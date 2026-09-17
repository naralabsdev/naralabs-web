export type AuroraTheme = "default" | "events" | "contracts" | "schemas";

export type AuroraThemeConfig = {
  colorA: string;
  colorB: string;
  fallback: string;
};

/** Shared NaraLabs aurora palette — used on landing, dashboard, and explorer pages. */
export const BRAND_AURORA: AuroraThemeConfig = {
  colorA: "#1344AF",
  colorB: "#8791E1",
  fallback: "#1344AF",
};

export const AURORA_THEMES: Record<AuroraTheme, AuroraThemeConfig> = {
  default: BRAND_AURORA,
  events: BRAND_AURORA,
  contracts: BRAND_AURORA,
  schemas: BRAND_AURORA,
};
