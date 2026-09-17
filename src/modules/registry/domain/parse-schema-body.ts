import type { SchemaBodyDefinition } from "@/modules/registry/domain/atlas-types";

export function parseSchemaBody(raw: unknown): SchemaBodyDefinition {
  if (typeof raw === "string") {
    try {
      return (JSON.parse(raw) as SchemaBodyDefinition) ?? {};
    } catch {
      return {};
    }
  }

  if (raw && typeof raw === "object") {
    return raw as SchemaBodyDefinition;
  }

  return {};
}

export function stringifySchemaBody(raw: unknown): string {
  if (typeof raw === "string") {
    try {
      return JSON.stringify(JSON.parse(raw), null, 2);
    } catch {
      return raw;
    }
  }

  return JSON.stringify(raw ?? {}, null, 2);
}
