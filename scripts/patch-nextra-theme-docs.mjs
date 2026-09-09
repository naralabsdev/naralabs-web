import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const layoutPath = join(root, "node_modules/nextra-theme-docs/dist/layout.js");

if (!existsSync(layoutPath)) {
  console.log("nextra-theme-docs not installed, skipping patch");
  process.exit(0);
}

const PATCHED_MARKER = "data?.darkMode === false";

let content = readFileSync(layoutPath, "utf8");

if (content.includes(PATCHED_MARKER)) {
  console.log("nextra-theme-docs already patched");
  process.exit(0);
}

const originalBlock = `  let t4;
  if ($[19] !== banner || $[20] !== nextThemes || $[21] !== t3) {
    t4 = /* @__PURE__ */ jsxs(ThemeProvider, { ...nextThemes, children: [
      t1,
      banner,
      t3
    ] });
    $[19] = banner;
    $[20] = nextThemes;
    $[21] = t3;
    $[22] = t4;
  } else {
    t4 = $[22];
  }
  let t5;
  if ($[23] !== rest || $[24] !== t4) {
    t5 = /* @__PURE__ */ jsx(ThemeConfigProvider, { value: rest, children: t4 });
    $[23] = rest;
    $[24] = t4;
    $[25] = t5;
  } else {
    t5 = $[25];
  }`;

const patchedBlock = `  let t4;
  if ($[19] !== banner || $[20] !== nextThemes || $[21] !== t3 || $[22] !== data?.darkMode) {
    t4 = data?.darkMode === false ? /* @__PURE__ */ jsxs(Fragment, { children: [
      t1,
      banner,
      t3
    ] }) : /* @__PURE__ */ jsxs(ThemeProvider, { ...nextThemes, children: [
      t1,
      banner,
      t3
    ] });
    $[19] = banner;
    $[20] = nextThemes;
    $[21] = t3;
    $[22] = data?.darkMode;
    $[23] = t4;
  } else {
    t4 = $[23];
  }
  let t5;
  if ($[24] !== rest || $[25] !== t4) {
    t5 = /* @__PURE__ */ jsx(ThemeConfigProvider, { value: rest, children: t4 });
    $[24] = rest;
    $[25] = t4;
    $[26] = t5;
  } else {
    t5 = $[26];
  }`;

let next = content;

next = next.replace(
  'import { jsx, jsxs } from "react/jsx-runtime";',
  'import { Fragment, jsx, jsxs } from "react/jsx-runtime";',
);

next = next.replace(
  "LayoutPropsSchema.safeParse(themeConfig)",
  "LayoutPropsSchema.safeParse({ ...themeConfig, children })",
);

next = next.replace("const $ = _c(26);", "const $ = _c(27);");

if (!next.includes(originalBlock)) {
  console.error(
    "nextra-theme-docs layout.js structure changed; manual update required for scripts/patch-nextra-theme-docs.mjs",
  );
  process.exit(1);
}

next = next.replace(originalBlock, patchedBlock);

writeFileSync(layoutPath, next, "utf8");
console.log("Patched nextra-theme-docs layout.js");
