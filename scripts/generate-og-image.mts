import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "fs";
import { join, dirname, basename, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const publicDir = join(rootDir, "public");
const docsDir = join(rootDir, "src", "content", "docs");
const changelogDir = join(rootDir, "src", "content", "changelog");

// Load fonts
const interBold = readFileSync(join(__dirname, "fonts", "Inter-Bold.ttf"));
const interRegular = readFileSync(join(__dirname, "fonts", "Inter-Regular.ttf"));

// Load logo (dark version for light background)
const logoBuffer = readFileSync(join(rootDir, "src", "assets", "logo-light.png"));
const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;

const WIDTH = 1200;
const HEIGHT = 630;

// Light theme colors (matching the site's Solarized Light palette)
const BG_COLOR = "#fdf6e3";
const TEXT_PRIMARY = "#1a1a1a";
const TEXT_MUTED = "#6b6b6b";
const TEXT_DIM = "#93a1a1";
const GRID_COLOR = "rgba(147, 161, 161, 0.08)";

const SECTION_MAP: Record<string, string> = {
  start: "Get Started",
  concepts: "Concepts",
  agents: "Agents & Tools",
  reference: "Reference",
  changelog: "Changelog",
};

const fonts = [
  { name: "Inter", data: interRegular, weight: 400 as const, style: "normal" as const },
  { name: "Inter", data: interBold, weight: 700 as const, style: "normal" as const },
];

// --- Page discovery ---

interface PageInfo {
  slug: string;
  title: string;
  description?: string;
  section?: string;
}

function parseFrontmatter(content: string): { title?: string; description?: string } {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const yaml = match[1];
  const title = yaml.match(/^title:\s*['"]?(.*?)['"]?\s*$/m)?.[1];
  const description = yaml.match(/^description:\s*['"]?(.*?)['"]?\s*$/m)?.[1];
  return { title, description };
}

function collectFiles(dir: string, ext: string[]): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...collectFiles(full, ext));
    } else if (ext.some((e) => full.endsWith(e))) {
      results.push(full);
    }
  }
  return results;
}

function discoverPages(): PageInfo[] {
  const pages: PageInfo[] = [];

  // Docs pages
  for (const file of collectFiles(docsDir, [".md", ".mdx"])) {
    const rel = relative(docsDir, file);
    const slug = rel.replace(/\.(mdx?|md)$/, "").replace(/\/index$/, "");
    const finalSlug = slug === "index" ? "" : slug;
    const content = readFileSync(file, "utf-8");
    const { title, description } = parseFrontmatter(content);
    if (!title) continue;
    const section = finalSlug.includes("/") ? finalSlug.split("/")[0] : undefined;
    pages.push({
      slug: finalSlug,
      title,
      description,
      section: section ? SECTION_MAP[section] : undefined,
    });
  }

  // Changelog entries
  for (const file of collectFiles(changelogDir, [".md"])) {
    const name = basename(file, ".md");
    const content = readFileSync(file, "utf-8");
    const { title, description } = parseFrontmatter(content);
    pages.push({
      slug: `changelog/${name}`,
      title: title || `v${name}`,
      description,
      section: "Changelog",
    });
  }

  // Changelog index (custom Astro page, not in content collection)
  pages.push({
    slug: "changelog",
    title: "Changelog",
    description: "All notable changes to Archcore.",
    section: "Changelog",
  });

  return pages;
}

// --- Image generation ---

function createOgNode(title: string, description?: string, breadcrumb?: string) {
  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: BG_COLOR,
        backgroundImage: `linear-gradient(${GRID_COLOR} 1px, transparent 1px), linear-gradient(90deg, ${GRID_COLOR} 1px, transparent 1px)`,
        backgroundSize: "70px 70px",
        padding: "60px 80px",
      },
      children: [
        // Logo + brand name
        {
          type: "div",
          props: {
            style: { display: "flex", alignItems: "center", gap: "16px" },
            children: [
              {
                type: "img",
                props: {
                  src: logoBase64,
                  width: 48,
                  height: 48,
                  style: { borderRadius: "4px" },
                },
              },
              {
                type: "span",
                props: {
                  style: {
                    fontSize: "28px",
                    fontWeight: 700,
                    color: TEXT_PRIMARY,
                    letterSpacing: "-0.02em",
                  },
                  children: "archcore",
                },
              },
            ],
          },
        },

        // Spacer
        { type: "div", props: { style: { flex: "1" } } },

        // Title
        {
          type: "div",
          props: {
            style: {
              fontSize: "48px",
              fontWeight: 700,
              color: TEXT_PRIMARY,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
            },
            children: title,
          },
        },

        // Description
        ...(description
          ? [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "22px",
                    color: TEXT_MUTED,
                    marginTop: "20px",
                    lineHeight: 1.5,
                    letterSpacing: "-0.01em",
                  },
                  children:
                    description.length > 120
                      ? description.slice(0, 117) + "..."
                      : description,
                },
              },
            ]
          : []),

        // Spacer
        { type: "div", props: { style: { flex: "1" } } },

        // Bottom bar
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            },
            children: [
              {
                type: "span",
                props: {
                  style: {
                    fontSize: "18px",
                    color: TEXT_DIM,
                    letterSpacing: "0.02em",
                  },
                  children: "docs.archcore.ai",
                },
              },
              ...(breadcrumb
                ? [
                    {
                      type: "span",
                      props: {
                        style: { fontSize: "16px", color: TEXT_DIM },
                        children: breadcrumb,
                      },
                    },
                  ]
                : []),
            ],
          },
        },
      ],
    },
  };
}

async function generateImage(
  title: string,
  outputPath: string,
  description?: string,
  breadcrumb?: string
): Promise<void> {
  const node = createOgNode(title, description, breadcrumb);
  const svg = await satori(node, { width: WIDTH, height: HEIGHT, fonts });
  const resvg = new Resvg(svg, { fitTo: { mode: "width" as const, value: WIDTH } });
  const png = resvg.render().asPng();

  const dir = dirname(outputPath);
  mkdirSync(dir, { recursive: true });
  writeFileSync(outputPath, png);
}

// --- Main ---

const pages = discoverPages();
console.log(`Generating ${pages.length} OG images...`);

const ogDir = join(publicDir, "og");

for (const page of pages) {
  const filename = page.slug === "" ? "index" : page.slug;
  const outputPath = join(ogDir, `${filename}.png`);
  await generateImage(page.title, outputPath, page.description, page.section);
  console.log(`  ${filename}.png`);
}

// Copy root page image as backward-compatible og-image.png
const rootImage = readFileSync(join(ogDir, "index.png"));
writeFileSync(join(publicDir, "og-image.png"), rootImage);

console.log(`\n✓ Generated ${pages.length} OG images in public/og/`);
