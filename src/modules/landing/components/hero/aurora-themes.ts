import { brandColors } from "@/shared/config/brand";

export type AuroraTheme = "default" | "events" | "contracts" | "schemas";

export type AuroraThemeConfig = {
  colorA: string;
  colorB: string;
  fallback: string;
};

/** Shared NaraLabs aurora palette — used on landing, dashboard, and explorer pages. */
export const BRAND_AURORA: AuroraThemeConfig = {
  colorA: brandColors.blue,
  colorB: brandColors.lilac,
  fallback: brandColors.blue,
};

export const AURORA_THEMES: Record<AuroraTheme, AuroraThemeConfig> = {
  default: BRAND_AURORA,
  events: BRAND_AURORA,
  contracts: BRAND_AURORA,
  schemas: BRAND_AURORA,
};
