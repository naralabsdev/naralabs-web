#!/usr/bin/env node
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cssFiles = [];

async function walk(dir) {
  const { readdir } = await import("node:fs/promises");
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.name === "node_modules" || entry.name === ".next") continue;
    if (entry.isDirectory()) {
      await walk(fullPath);
      continue;
    }
    if (entry.name.endsWith(".css")) {
      cssFiles.push(fullPath);
    }
  }
}

function resolveImport(fromFile, importPath) {
  if (!importPath.startsWith(".") && !importPath.startsWith("/")) {
    return null;
  }
  const base = path.resolve(path.dirname(fromFile), importPath);
  const candidates = [base, `${base}.css`];
  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

async function main() {
  await walk(path.join(root, "src"));
  const errors = [];

  for (const file of cssFiles) {
    const content = await readFile(file, "utf8");
    const imports = [...content.matchAll(/@import\s+["']([^"']+)["']/g)];

    for (const [, importPath] of imports) {
      const resolved = resolveImport(file, importPath);
      if (resolved === null && (importPath.startsWith(".") || importPath.startsWith("/"))) {
        errors.push(`${path.relative(root, file)} → missing import "${importPath}"`);
      }
    }
  }

  if (errors.length > 0) {
    console.error("CSS import validation failed:\n");
    for (const error of errors) {
      console.error(`  • ${error}`);
    }
    process.exit(1);
  }

  console.log(`CSS imports OK (${cssFiles.length} files checked)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
