import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const publicDir = join(rootDir, "public");

// Load fonts
const interBold = readFileSync(join(__dirname, "fonts", "Inter-Bold.ttf"));
const interRegular = readFileSync(join(__dirname, "fonts", "Inter-Regular.ttf"));

// Load logo (light version for dark background)
const logoBuffer = readFileSync(join(rootDir, "src", "assets", "logo-dark.png"));
const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;

const WIDTH = 1200;
const HEIGHT = 630;

// Dark theme colors (matching the landing site's dark OG card)
const BG_COLOR = "#1a1816";
const TEXT_PRIMARY = "#ede8df";
const TEXT_MUTED = "#9a9590";
const TEXT_DIM = "#5c5855";
const GRID_COLOR = "rgba(255, 255, 255, 0.03)";
const ACCENT = "#7c7570";

const svg = await satori(
  {
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
        // Logo + brand name + "Docs" badge
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "16px",
            },
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
              {
                type: "span",
                props: {
                  style: {
                    fontSize: "16px",
                    fontWeight: 400,
                    color: ACCENT,
                    border: `1px solid ${ACCENT}`,
                    borderRadius: "6px",
                    padding: "4px 12px",
                    marginLeft: "4px",
                  },
                  children: "docs",
                },
              },
            ],
          },
        },

        // Spacer
        { type: "div", props: { style: { flex: "1" } } },

        // Main headline
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "56px",
                    fontWeight: 700,
                    color: TEXT_PRIMARY,
                    lineHeight: 1.1,
                    letterSpacing: "-0.03em",
                  },
                  children: "Git-native context for",
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "56px",
                    fontWeight: 700,
                    color: TEXT_PRIMARY,
                    lineHeight: 1.1,
                    letterSpacing: "-0.03em",
                  },
                  children: "AI coding agents",
                },
              },
            ],
          },
        },

        // Subtitle
        {
          type: "div",
          props: {
            style: {
              fontSize: "22px",
              color: TEXT_MUTED,
              marginTop: "24px",
              lineHeight: 1.5,
              letterSpacing: "-0.01em",
            },
            children:
              "Guides, concepts, and reference for setting up and using Archcore in your repositories.",
          },
        },

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
              {
                type: "span",
                props: {
                  style: {
                    fontSize: "16px",
                    color: TEXT_DIM,
                  },
                  children: "Quick start  ·  Concepts  ·  Agent integrations  ·  Reference",
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      {
        name: "Inter",
        data: interRegular,
        weight: 400,
        style: "normal" as const,
      },
      {
        name: "Inter",
        data: interBold,
        weight: 700,
        style: "normal" as const,
      },
    ],
  }
);

const resvg = new Resvg(svg, {
  fitTo: { mode: "width" as const, value: WIDTH },
});
const png = resvg.render().asPng();

const outputPath = join(publicDir, "og-image.png");
writeFileSync(outputPath, png);

console.log(`✓ Generated OG image: ${outputPath} (${png.length} bytes)`);
