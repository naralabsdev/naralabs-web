import { copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

copyFileSync(
  join(root, "node_modules/nextra-theme-docs/dist/style.css"),
  join(root, "public/nextra-docs.css"),
);

console.log("Synced nextra-docs.css to public/");
