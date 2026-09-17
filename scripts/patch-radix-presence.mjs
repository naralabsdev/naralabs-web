import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const nodeModulesRoot = join(root, "node_modules");

const PATCHED_MARKER = "shouldAttachRef(child)";
const originalLine =
  "  return forceMount || presence.isPresent ? React2.cloneElement(child, { ref }) : null;";
const patchedBlock = `  const shouldAttachRef = (element) => {
    if (!React2.isValidElement(element)) return false;
    return element.type !== React2.Fragment && element.type !== Symbol.for("react.fragment");
  };
  return forceMount || presence.isPresent
    ? shouldAttachRef(child)
      ? React2.cloneElement(child, { ref })
      : child
    : null;`;

function findPresenceFiles(dir, results = []) {
  if (!existsSync(dir)) {
    return results;
  }

  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);

    try {
      const stats = statSync(fullPath);

      if (stats.isDirectory()) {
        if (entry === ".bin") {
          continue;
        }
        findPresenceFiles(fullPath, results);
        continue;
      }

      if (
        entry === "index.mjs" &&
        fullPath.includes(`${join("@radix-ui", "react-presence", "dist")}`)
      ) {
        results.push(fullPath);
      }

      if (
        entry === "index.js" &&
        fullPath.includes(`${join("@radix-ui", "react-presence", "dist")}`)
      ) {
        results.push(fullPath);
      }
    } catch {
      // Ignore unreadable paths.
    }
  }

  return results;
}

const targets = findPresenceFiles(nodeModulesRoot);
let patchedCount = 0;

for (const filePath of targets) {
  let content = readFileSync(filePath, "utf8");

  if (content.includes(PATCHED_MARKER)) {
    continue;
  }

  if (!content.includes(originalLine)) {
    console.warn(`react-presence patch pattern not found in ${filePath}`);
    continue;
  }

  content = content.replace(originalLine, patchedBlock);
  writeFileSync(filePath, content);
  patchedCount += 1;
  console.log(`Patched ${filePath}`);
}

if (patchedCount === 0) {
  console.log("react-presence already patched or not installed");
}
