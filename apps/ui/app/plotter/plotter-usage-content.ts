export function plotterDownload(filename: string) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/ui";
  return `${basePath}/plotter/downloads/${filename}`;
}

export const drawingPrompt = `Use $plotter to illustrate agent registration: an identity, name, and tools become one registry record.

Choose a bundled construction reference. Keep the forms transparent, the labels sparse, and the grid only if it explains the relationship.

Deliver an editable 560 × 440 SVG and a self-contained export. Explain the main relationship and what you inspected.`;

export const animationPrompt = `Use $plotter to animate the attached assembly-line SVG. A core lowers into its carrier, the line advances, and the next core arrives.

Preserve its composition, transparent forms, line hierarchy, and core-only hatching. Keep the hatch attached to each core and give shared contact edges one stroke owner.

Deliver editable HTML with the SVG and styles included, pause/resume and replay, visibility pausing, and a static fallback for reduced motion.`;
