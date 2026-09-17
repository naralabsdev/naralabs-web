import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const nodeModulesRoot = join(root, "node_modules");

const PATCHED_MARKER = "isReactFragment";

const oldSlotPattern =
  "      if (children.type !== React.Fragment) {\n        props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;\n      }";

const oldSlotReplacement = `      const isReactFragment = (type) => type === React.Fragment || type === Symbol.for("react.fragment");
      if (!isReactFragment(children.type)) {
        props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
      }`;

const newSlotPattern =
  "    if (slottableElement.type !== React.Fragment) {\n      mergedProps.ref = forwardedRef ? composedRef : slottableElementRef;\n    }";

const newSlotReplacement = `    const isReactFragment = (type) => type === React.Fragment || type === Symbol.for("react.fragment");
    if (!isReactFragment(slottableElement.type)) {
      mergedProps.ref = forwardedRef ? composedRef : slottableElementRef;
    }`;

function findSlotFiles(dir, results = []) {
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
        findSlotFiles(fullPath, results);
        continue;
      }

      if (
        (entry === "index.mjs" || entry === "index.js") &&
        fullPath.includes(`${join("@radix-ui", "react-slot", "dist")}`)
      ) {
        results.push(fullPath);
      }
    } catch {
      // Ignore unreadable paths.
    }
  }

  return results;
}

const targets = findSlotFiles(nodeModulesRoot);
let patchedCount = 0;

for (const filePath of targets) {
  let content = readFileSync(filePath, "utf8");

  if (content.includes(PATCHED_MARKER)) {
    continue;
  }

  let updated = false;

  if (content.includes(oldSlotPattern)) {
    content = content.replace(oldSlotPattern, oldSlotReplacement);
    updated = true;
  }

  if (content.includes(newSlotPattern)) {
    content = content.replace(newSlotPattern, newSlotReplacement);
    updated = true;
  }

  if (!updated) {
    console.warn(`react-slot patch pattern not found in ${filePath}`);
    continue;
  }

  writeFileSync(filePath, content);
  patchedCount += 1;
  console.log(`Patched ${filePath}`);
}

if (patchedCount === 0) {
  console.log("react-slot already patched or not installed");
}
