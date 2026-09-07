#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import postcssImport from "postcss-import";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const GLOBALS_CSS = path.join(ROOT, "src/app/globals.css");

async function main() {
  const input = await readFile(GLOBALS_CSS, "utf8");

  await postcss([postcssImport(), tailwindcss(path.join(ROOT, "tailwind.config.ts")), autoprefixer()]).process(
    input,
    {
      from: GLOBALS_CSS,
    },
  );

  console.log("CSS compile OK (Tailwind/PostCSS processed globals.css)");
}

main().catch((error) => {
  console.error("\nCSS compile validation failed:");
  console.error(error.message ?? error);
  process.exit(1);
});
