import { copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

copyFileSync(
  join(root, "node_modules/nextra-theme-docs/dist/style.css"),
  join(root, "public/nextra-docs.css"),
);

copyFileSync(
  join(root, "src/app/(docs)/docs/docs.css"),
  join(root, "public/docs-theme.css"),
);

console.log("Synced nextra-docs.css and docs-theme.css to public/");
