import fs from "node:fs/promises";
import path from "node:path";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;

  // Construct the file path from the slug
  // If we have ['docs', 'filename'], look in (root) directory
  let filePath: string;
  if (slug.length === 2 && slug[0] === "docs") {
    filePath = path.join(
      process.cwd(),
      "content",
      "docs",
      "(root)",
      slug[1] || "",
    );
  } else {
    filePath = path.join(process.cwd(), "content", ...slug);
  }

  // Check for both .mdx and .md extensions
  const mdxPath = filePath.endsWith(".mdx") ? filePath : `${filePath}.mdx`;
  const mdPath = filePath.endsWith(".md") ? filePath : `${filePath}.md`;

  try {
    let content: string;

    // Try .mdx first, then .md
    try {
      content = await fs.readFile(mdxPath, "utf-8");
    } catch {
      content = await fs.readFile(mdPath, "utf-8");
    }

    // Return raw markdown with appropriate headers
    return new NextResponse(content, {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
