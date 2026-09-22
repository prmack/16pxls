// Build script for 16pxls.
// Replaces the old gulpfile.js entirely — no gulp, no gulp-* plugins.
//
// Reads raw SVGs from src/svg, and writes:
//   dist/svg/*.svg                       - optimised, license-commented icons
//   dist/sprite.svg                      - single <symbol>-based sprite
//   dist/css/16pxls.css                  - .icon-Name background-image classes
//   dist/docs/                           - icon reference page (no Bootstrap, no jQuery)
//   dist/docs/assets/json/iconList.json  - flat list of icon names
//
// Usage: node scripts/build.js

import {
  readFile,
  writeFile,
  copyFile,
  mkdir,
  rm,
  readdir,
} from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { optimize } from "svgo";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src/svg");
const STATIC_DIR = path.join(ROOT, "static");
const DIST_DIR = path.join(ROOT, "dist");
const DIST_SVG_DIR = path.join(DIST_DIR, "svg");
const DIST_CSS_DIR = path.join(DIST_DIR, "css");
const DIST_DOCS_DIR = path.join(DIST_DIR, "docs");
const DIST_JSON_DIR = path.join(DIST_DOCS_DIR, "assets/json");
const DIST_DOCS_CSS_DIR = path.join(DIST_DOCS_DIR, "assets/css");
const DIST_DOCS_JS_DIR = path.join(DIST_DOCS_DIR, "assets/js");
const DIST_DOCS_IMG_DIR = path.join(DIST_DOCS_DIR, "assets/images");

const LICENSE_HEADER = `<!--
16pxls (c) Paul Mackenzie

16pxls is licensed under a
Creative Commons Attribution-ShareAlike 4.0 International License.

You should have received a copy of the license along with this
work. If not, see <http://creativecommons.org/licenses/by-sa/4.0/>.
-->
`;

const SVGO_CONFIG = {
  multipass: true,
  // SVGO 4's preset-default no longer strips viewBox, which is what the
  // sprite's <symbol> elements rely on — no override needed here.
  plugins: ["preset-default"],
};

// Minimal, dependency-free SVG-to-data-URI encoder (URL-encoded, not base64 —
// smaller and diffable in git).
function svgToDataUri(svg) {
  const encoded = svg
    .replace(/"/g, "'")
    .replace(/</g, "%3C")
    .replace(/>/g, "%3E")
    .replace(/&/g, "%26")
    .replace(/#/g, "%23")
    .replace(/\s+/g, " ")
    .trim();
  return `data:image/svg+xml,${encoded}`;
}

function extractViewBoxAndInner(svg) {
  const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
  const innerMatch = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  return {
    viewBox: viewBoxMatch ? viewBoxMatch[1] : "0 0 16 16",
    inner: innerMatch ? innerMatch[1].trim() : "",
  };
}

async function clean() {
  await rm(DIST_DIR, { recursive: true, force: true });
  await mkdir(DIST_SVG_DIR, { recursive: true });
  await mkdir(DIST_CSS_DIR, { recursive: true });
  await mkdir(DIST_JSON_DIR, { recursive: true });
  await mkdir(DIST_DOCS_CSS_DIR, { recursive: true });
  await mkdir(DIST_DOCS_JS_DIR, { recursive: true });
  await mkdir(DIST_DOCS_IMG_DIR, { recursive: true });
}

// Hand-rolled docs page: a CSS grid + vanilla JS, replacing ~1.4MB of
// vendored Bootstrap and jQuery that were only ever used to lay out a
// grid of <img> tags. The icon list is baked into the generated script
// at build time (not fetch()'d) so the page still works opened directly
// from disk, with no local server — same constraint the old hardcoded
// array was working around, just no longer hand-maintained.
async function writeDocs(icons) {
  const css = `body { font-family: system-ui, sans-serif; margin: 0; padding: 40px; background: #fafafa; color: #111; }
.row { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 16px; list-style: none; padding: 0; }
.cell { text-align: center; padding: 16px; border-radius: 6px; }
.cell:hover { background: #eee; }
.icon { width: 24px; height: 24px; margin: 0 auto 8px; display: block; }
.cell span { font-size: 11px; word-break: break-word; }
`;
  await writeFile(path.join(DIST_DOCS_CSS_DIR, "style.css"), css, "utf8");

  const js = `const fileList = ${JSON.stringify(icons)};
const row = document.querySelector('.row');
for (const name of fileList) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.innerHTML = '<svg class="icon"><use href="../sprite.svg#icon-' + name + '"></use></svg><span>' + name + '</span>';
  row.appendChild(cell);
}
`;
  await writeFile(path.join(DIST_DOCS_JS_DIR, "scripts.js"), js, "utf8");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>16pxls - Documentation</title>
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <img src="assets/images/readme.png" alt="16pxls preview" style="max-width:100%;margin-bottom:24px;">
  <div class="row"></div>
  <script src="assets/js/scripts.js"></script>
</body>
</html>
`;
  await writeFile(path.join(DIST_DOCS_DIR, "index.html"), html, "utf8");

  const readmeImg = path.join(STATIC_DIR, "readme.png");
  if (existsSync(readmeImg)) {
    await copyFile(readmeImg, path.join(DIST_DOCS_IMG_DIR, "readme.png"));
  } else {
    console.warn(`No static/readme.png found — skipping docs preview image.`);
  }
}

async function build() {
  if (!existsSync(SRC_DIR)) {
    console.error(`No src/svg directory found at ${SRC_DIR}.`);
    console.error(
      "Move the raw icon SVGs there first (one-off): mkdir -p src/svg && git mv dist/svg/*.svg src/svg/",
    );
    process.exit(1);
  }

  await clean();

  const files = (await readdir(SRC_DIR)).filter((f) => f.endsWith(".svg"));
  if (files.length === 0) {
    console.error(`No .svg files found in ${SRC_DIR}.`);
    process.exit(1);
  }

  const icons = [];
  const symbols = [];
  const cssRules = [
    ".icon { display: inline-block; width: 16px; height: 16px; background-repeat: no-repeat; background-size: contain; }",
  ];

  for (const file of files) {
    const name = path.basename(file, ".svg");
    const raw = await readFile(path.join(SRC_DIR, file), "utf8");
    const { data: optimised } = optimize(raw, { ...SVGO_CONFIG, path: file });

    await writeFile(
      path.join(DIST_SVG_DIR, file),
      LICENSE_HEADER + optimised,
      "utf8",
    );

    const { viewBox, inner } = extractViewBoxAndInner(optimised);
    symbols.push(
      `<symbol id="icon-${name}" viewBox="${viewBox}">${inner}</symbol>`,
    );
    cssRules.push(
      `.icon-${name} { background-image: url("${svgToDataUri(optimised)}"); }`,
    );
    icons.push(name);
  }

  icons.sort();
  symbols.sort();

  const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n  ${symbols.join("\n  ")}\n</svg>\n`;
  await writeFile(path.join(DIST_DIR, "sprite.svg"), sprite, "utf8");

  await writeFile(
    path.join(DIST_CSS_DIR, "16pxls.css"),
    cssRules.join("\n") + "\n",
    "utf8",
  );

  await writeFile(
    path.join(DIST_JSON_DIR, "iconList.json"),
    JSON.stringify(icons, null, 2),
    "utf8",
  );

  await writeDocs(icons);

  console.log(
    `Built ${icons.length} icons -> dist/svg, dist/sprite.svg, dist/css/16pxls.css, dist/docs`,
  );
}

build();
