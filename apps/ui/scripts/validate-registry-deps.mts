import { promises as fs } from "node:fs";
import path from "node:path";

// Path to particles directory
const particlesDir = path.join(process.cwd(), "registry/default/particles");

// Path to registry UI components directory
const registryUIDir = path.join(process.cwd(), "registry/default/ui");

// Path to registry hooks directory
const registryHooksDir = path.join(process.cwd(), "registry/default/hooks");

// Path to registry lib directory
const registryLibDir = path.join(process.cwd(), "registry/default/lib");

// Path to registry files
const registryParticlesFile = path.join(
  process.cwd(),
  "registry/registry-particles.ts",
);
const registryUIFile = path.join(process.cwd(), "registry/registry-ui.ts");

// Map component name to @coss package name
function getRegistryPackageName(componentName: string): string {
  return `@coss/${componentName}`;
}

// Extract component name from file path
function getComponentName(filePath: string): string {
  const basename = path.basename(filePath, ".tsx");
  return basename;
}

// Parse imports from a TypeScript file
function parseImports(content: string): {
  registryDependencies: string[];
  dependencies: string[];
  importPaths: string[]; // Keep track of full import paths for dependency checking
} {
  const registryDeps = new Set<string>();
  const deps = new Set<string>();
  const importPaths: string[] = [];

  // Match import statements - more comprehensive pattern
  const importRegex =
    /import\s+(?:type\s+)?(?:[\w*{}\s,]+from\s+)?["']([^"']+)["']/g;
  let match: RegExpExecArray | null = importRegex.exec(content);

  while (match !== null) {
    const importPath = match[1];
    importPaths.push(importPath);
    match = importRegex.exec(content);

    const blockMatch = importPath.match(
      /@\/registry\/default\/blocks\/([^/]+)/,
    );
    if (blockMatch) {
      registryDeps.add(getRegistryPackageName(blockMatch[1]));
      continue;
    }

    // Check if it's a registry UI component import (@/registry/default/ui/*)
    const registryUIMatch = importPath.match(
      /@\/registry\/default\/ui\/([^/]+)/,
    );
    if (registryUIMatch) {
      const componentName = registryUIMatch[1];
      registryDeps.add(getRegistryPackageName(componentName));
      continue;
    }

    // Check if it's a registry hook import (@/registry/default/hooks/*)
    const registryHookMatch = importPath.match(
      /@\/registry\/default\/hooks\/([^/]+)/,
    );
    if (registryHookMatch) {
      const hookName = registryHookMatch[1].replace(/\.ts$/, ""); // Remove .ts extension if present
      registryDeps.add(getRegistryPackageName(hookName));
      continue;
    }

    // Check if it's a registry lib import (@/registry/default/lib/*)
    const registryLibMatch = importPath.match(
      /@\/registry\/default\/lib\/([^/]+)/,
    );
    if (registryLibMatch) {
      const libName = registryLibMatch[1].replace(/\.ts$/, ""); // Remove .ts extension if present
      // Skip utils as it's a common utility file that shouldn't be treated as a dependency
      if (libName !== "utils") {
        registryDeps.add(getRegistryPackageName(libName));
      }
      continue;
    }

    // Check if it's already a @coss import
    if (importPath.startsWith("@coss/")) {
      // Skip @coss/utils as it's a common utility that shouldn't be treated as a dependency
      if (importPath !== "@coss/utils") {
        registryDeps.add(importPath);
      }
      continue;
    }

    // Check if it's a relative import (skip)
    if (importPath.startsWith(".") || importPath.startsWith("/")) {
      continue;
    }

    // Check if it's an alias import that might be a component
    if (importPath.startsWith("@/")) {
      // Could be @/components/ui/* or similar - skip for now
      continue;
    }

    // Everything else is an external dependency
    // Extract package name (handle scoped packages like @radix-ui/react-accordion)
    const packageMatch = importPath.match(/^(@?[^/]+(?:\/[^/]+)?)/);
    if (packageMatch) {
      const packageName = packageMatch[1];
      // Skip built-in modules, React, Next.js, lucide-react, and class-variance-authority
      if (
        !packageName.startsWith("node:") &&
        packageName !== "react" &&
        packageName !== "react-dom" &&
        packageName !== "lucide-react" &&
        packageName !== "next" &&
        packageName !== "class-variance-authority" &&
        !packageName.startsWith("react/") &&
        !packageName.startsWith("react-dom/") &&
        !importPath.startsWith("next/")
      ) {
        // Store the full import path, not just the package name, for better dependency checking
        deps.add(importPath);
      }
    }
  }

  return {
    dependencies: Array.from(deps).sort(),
    importPaths,
    registryDependencies: Array.from(registryDeps).sort(),
  };
}

// Extract registryDependencies and dependencies from registry item
function extractRegistryItemDeps(itemContent: string): {
  registryDependencies: string[];
  dependencies: string[];
} {
  const regDeps: string[] = [];
  const deps: string[] = [];

  // Extract registryDependencies
  const regDepsMatch = itemContent.match(
    /registryDependencies:\s*\[([^\]]*)\]/,
  );
  if (regDepsMatch) {
    regDepsMatch[1].split(",").forEach((item) => {
      const cleaned = item.trim().replace(/["']/g, "").replace(/\n/g, "");
      // Skip @coss/utils as it's a common utility that shouldn't be validated
      if (cleaned && cleaned !== "@coss/utils") {
        regDeps.push(cleaned);
      }
    });
  }

  // Extract dependencies (exclude lucide-react, next, and class-variance-authority)
  const depsMatch = itemContent.match(/dependencies:\s*\[([^\]]*)\]/);
  if (depsMatch) {
    depsMatch[1].split(",").forEach((item) => {
      const cleaned = item.trim().replace(/["']/g, "").replace(/\n/g, "");
      if (
        cleaned &&
        cleaned !== "lucide-react" &&
        cleaned !== "next" &&
        cleaned !== "class-variance-authority"
      ) {
        deps.push(cleaned);
      }
    });
  }

  return {
    dependencies: deps.sort(),
    registryDependencies: regDeps.sort(),
  };
}

// Cache for registry component imports to avoid reading files multiple times
const registryComponentImportsCache = new Map<string, Set<string>>();

// Get all imports from a registry component file (UI, hook, or lib)
async function getRegistryComponentImports(
  componentName: string,
): Promise<Set<string>> {
  // Check cache first
  const cached = registryComponentImportsCache.get(componentName);
  if (cached) {
    return cached;
  }

  const imports = new Set<string>();

  // Try to find the file in UI, hooks, or lib directories
  const possiblePaths = [
    path.join(registryUIDir, `${componentName}.tsx`),
    path.join(registryHooksDir, `${componentName}.ts`),
    path.join(registryLibDir, `${componentName}.ts`),
  ];

  for (const filePath of possiblePaths) {
    try {
      const content = await fs.readFile(filePath, "utf8");
      // Extract all import paths
      const importRegex =
        /import\s+(?:type\s+)?(?:[\w*{}\s,]+from\s+)?["']([^"']+)["']/g;
      let match: RegExpExecArray | null = importRegex.exec(content);

      while (match !== null) {
        imports.add(match[1]);
        match = importRegex.exec(content);
      }
      // If we successfully read the file, break
      break;
    } catch (_error) {}
  }

  registryComponentImportsCache.set(componentName, imports);
  return imports;
}

// Check if a dependency is covered by any of the registry dependencies
// by checking if the registry UI component files actually import it
async function isDependencyCoveredByRegistry(
  dep: string,
  registryDeps: string[],
): Promise<boolean> {
  // For each registry dependency, check if its component file imports this dependency
  for (const regDep of registryDeps) {
    // Extract component name from @coss/component-name
    const componentMatch = regDep.match(/@coss\/(.+)/);
    if (!componentMatch) continue;

    const componentName = componentMatch[1];
    const componentImports = await getRegistryComponentImports(componentName);

    // Check if the dependency (or a parent package) is imported
    // For example, if dep is "@base-ui/react/autocomplete"
    // and component imports "@base-ui/react/autocomplete", it's covered
    // Or if dep is "@base-ui/react" and component imports any "@base-ui/react/*", it's covered
    if (componentImports.has(dep)) {
      return true;
    }

    // Check if the dependency is a parent package of any import
    // e.g., dep is "@base-ui/react" and component imports "@base-ui/react/autocomplete"
    if (!dep.includes("/")) {
      // If dep is a base package, check if any import starts with it
      for (const importPath of componentImports) {
        if (importPath.startsWith(`${dep}/`) || importPath === dep) {
          return true;
        }
      }
    }
  }

  return false;
}

// Filter out dependencies that are already covered by registry dependencies
// Note: We don't filter based on base packages here because dependencyMatches handles that during comparison
async function filterDependenciesCoveredByRegistry(
  dependencies: string[],
  registryDependencies: string[],
): Promise<string[]> {
  const filtered: string[] = [];
  for (const dep of dependencies) {
    // Check if it's covered by a registry component's imports
    const isCoveredByRegistry = await isDependencyCoveredByRegistry(
      dep,
      registryDependencies,
    );
    if (isCoveredByRegistry) {
      continue;
    }

    filtered.push(dep);
  }
  return filtered;
}

// Check if a dependency matches (handles sub-paths like @base-ui/react/accordion matching @base-ui/react)
function dependencyMatches(expected: string, actual: string): boolean {
  if (expected === actual) return true;

  // Check if expected is a sub-path of actual (e.g., @base-ui/react/accordion matches @base-ui/react)
  if (expected.startsWith(`${actual}/`)) return true;

  // Check if actual is a sub-path of expected (e.g., @base-ui/react matches @base-ui/react/accordion)
  if (actual.startsWith(`${expected}/`)) return true;

  return false;
}

// Compare two arrays and return differences (with sub-path matching)
function compareArrays(
  expected: string[],
  actual: string[],
): { missing: string[]; extra: string[] } {
  const missing: string[] = [];
  const extra: string[] = [];

  // Find missing items (in expected but not in actual, accounting for sub-paths)
  for (const exp of expected) {
    const found = actual.some((act) => dependencyMatches(exp, act));
    if (!found) {
      missing.push(exp);
    }
  }

  // Find extra items (in actual but not in expected, accounting for sub-paths)
  for (const act of actual) {
    const found = expected.some((exp) => dependencyMatches(exp, act));
    if (!found) {
      extra.push(act);
    }
  }

  return { extra, missing };
}

// Find object boundaries in registry content for a given component name
function findRegistryItemBounds(
  componentName: string,
  registryContent: string,
): { start: number; end: number } | null {
  const namePattern = new RegExp(
    `name:\\s*"${componentName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`,
  );
  const nameMatch = registryContent.match(namePattern);

  if (!nameMatch || nameMatch.index === undefined) {
    return null;
  }

  const nameMatchIndex = nameMatch.index;
  let objStart = -1;
  let depth = 0;
  let inString = false;
  let stringChar = "";

  // Find opening brace
  for (let i = nameMatchIndex - 1; i >= 0; i--) {
    const char = registryContent[i];
    const prevChar = i > 0 ? registryContent[i - 1] : "";

    if (!inString && (char === '"' || char === "'")) {
      inString = true;
      stringChar = char;
    } else if (inString && char === stringChar && prevChar !== "\\") {
      inString = false;
    } else if (!inString) {
      if (char === "}") {
        depth++;
      } else if (char === "{") {
        if (depth === 0) {
          objStart = i;
          break;
        }
        depth--;
      }
    }
  }

  if (objStart === -1) {
    return null;
  }

  // Find closing brace
  depth = 0;
  inString = false;
  stringChar = "";
  let objEnd = objStart;

  while (objEnd < registryContent.length) {
    const char = registryContent[objEnd];
    const prevChar = objEnd > 0 ? registryContent[objEnd - 1] : "";

    if (!inString && (char === '"' || char === "'")) {
      inString = true;
      stringChar = char;
    } else if (inString && char === stringChar && prevChar !== "\\") {
      inString = false;
    } else if (!inString) {
      if (char === "{") depth++;
      if (char === "}") {
        depth--;
        if (depth === 0) {
          objEnd++;
          break;
        }
      }
    }
    objEnd++;
  }

  return { end: objEnd, start: objStart };
}

// Report validation errors for a component
function reportValidationErrors(
  componentName: string,
  regDepsDiff: { missing: string[]; extra: string[] },
  depsDiff: { missing: string[]; extra: string[] },
  expectedRegDeps: string[],
  actualRegDeps: string[],
  filteredExpectedDeps: string[],
  actualDeps: string[],
): void {
  console.log(`❌ ${componentName}:`);

  const hasRegDepsIssues =
    regDepsDiff.missing.length > 0 || regDepsDiff.extra.length > 0;
  const hasDepsIssues =
    depsDiff.missing.length > 0 || depsDiff.extra.length > 0;

  if (hasRegDepsIssues) {
    if (regDepsDiff.missing.length > 0) {
      console.log(
        `   Missing registryDependencies: ${regDepsDiff.missing.join(", ")}`,
      );
    }
    if (regDepsDiff.extra.length > 0) {
      console.log(
        `   Extra registryDependencies: ${regDepsDiff.extra.join(", ")}`,
      );
    }
    console.log(`   Expected: [${expectedRegDeps.join(", ")}]`);
    console.log(`   Actual: [${actualRegDeps.join(", ")}]`);
  }

  if (hasDepsIssues) {
    if (depsDiff.missing.length > 0) {
      console.log(`   Missing dependencies: ${depsDiff.missing.join(", ")}`);
    }
    if (depsDiff.extra.length > 0) {
      console.log(`   Extra dependencies: ${depsDiff.extra.join(", ")}`);
    }
    console.log(`   Expected: [${filteredExpectedDeps.join(", ")}]`);
    console.log(`   Actual: [${actualDeps.join(", ")}]`);
  }

  console.log("");
}

// Validate a single registry item
async function validateRegistryItem(
  componentName: string,
  componentFile: string,
  registryContent: string,
): Promise<boolean> {
  const content = await fs.readFile(componentFile, "utf8");
  const { registryDependencies: expectedRegDeps, dependencies: expectedDeps } =
    parseImports(content);

  const bounds = findRegistryItemBounds(componentName, registryContent);
  if (!bounds) {
    console.log(`❌ ${componentName}: Not found in registry`);
    return false;
  }

  const itemContent = registryContent.substring(bounds.start, bounds.end);
  const { registryDependencies: actualRegDeps, dependencies: actualDeps } =
    extractRegistryItemDeps(itemContent);

  const filteredExpectedDeps = await filterDependenciesCoveredByRegistry(
    expectedDeps,
    expectedRegDeps,
  );

  const regDepsDiff = compareArrays(expectedRegDeps, actualRegDeps);
  const depsDiff = compareArrays(filteredExpectedDeps, actualDeps);

  const hasIssues =
    regDepsDiff.missing.length > 0 ||
    regDepsDiff.extra.length > 0 ||
    depsDiff.missing.length > 0 ||
    depsDiff.extra.length > 0;

  if (hasIssues) {
    reportValidationErrors(
      componentName,
      regDepsDiff,
      depsDiff,
      expectedRegDeps,
      actualRegDeps,
      filteredExpectedDeps,
      actualDeps,
    );
    return false;
  }

  return true;
}

// Validate a set of files against a registry file
async function validateFiles(
  files: string[],
  fileDir: string,
  registryFile: string,
  getName: (file: string) => string,
  label: string,
): Promise<number> {
  console.log(`  Found ${files.length} ${label} files\n`);

  const registryContent = await fs.readFile(registryFile, "utf8");
  let errors = 0;

  for (const file of files) {
    const filePath = path.join(fileDir, file);
    const componentName = getName(file);
    const isValid = await validateRegistryItem(
      componentName,
      filePath,
      registryContent,
    );
    if (!isValid) {
      errors++;
    }
  }

  return errors;
}

async function validateRegistryDependencies() {
  console.log("🔍 Validating registry dependencies...\n");

  // Validate particles
  const particleFiles = await fs.readdir(particlesDir);
  const tsxFiles = particleFiles.filter(
    (file) => file.endsWith(".tsx") && file.startsWith("p-"),
  );

  const particleErrors = await validateFiles(
    tsxFiles,
    particlesDir,
    registryParticlesFile,
    getComponentName,
    "particle",
  );

  // Validate UI components
  const uiFiles = await fs.readdir(registryUIDir);
  const uiTsxFiles = uiFiles.filter((file) => file.endsWith(".tsx"));

  const uiErrors = await validateFiles(
    uiTsxFiles,
    registryUIDir,
    registryUIFile,
    (file) => path.basename(file, ".tsx"),
    "UI component",
  );

  const totalErrors = particleErrors + uiErrors;

  if (totalErrors === 0) {
    console.log("✅ All registry dependencies are correct!");
  } else {
    console.log(
      `\n❌ Found ${totalErrors} item(s) with mismatched dependencies`,
    );
    process.exit(1);
  }
}

try {
  await validateRegistryDependencies();
} catch (error) {
  console.error("❌ Error:", error);
  process.exit(1);
}
