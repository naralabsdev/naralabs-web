export const EXPLORER_DETAIL_PAGE_COPY = {
  event: {
    title: "Event Details",
    description:
      "Inspect Soroban event metadata, topics, decoded values, and raw XDR.",
  },
  contract: {
    title: "Contract Details",
    description:
      "Activity, schema registry status, and published event schemas for this Soroban contract.",
  },
  schemaEvent: {
    title: "Event Schema",
    description:
      "SEP-0048 mapping, version history, and trust status for this published schema.",
  },
  schemaContract: {
    title: "Contract Schemas",
    description:
      "Published SEP-0048 schemas and indexed activity for this contract.",
  },
  schemaBundle: {
    title: "Schema Bundle",
    description:
      "Event definitions published together under a single schema bundle version.",
  },
} as const;
