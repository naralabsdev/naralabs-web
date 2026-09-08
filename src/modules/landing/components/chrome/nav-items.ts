"use client";

import {
  Bolt,
  BracketsCurly,
  InputSearch,
} from "@/shared/ui/icons/nucleo";
import type { NavItem } from "@/shared/ui/nav/nav";
import { getDocsUrl } from "@/shared/config/site";

export const NARALABS_EXPLORE_CHILD_ITEMS = [
  {
    title: "Events",
    description: "Browse decoded Soroban events in readable format",
    href: "/events",
    icon: Bolt,
  },
  {
    title: "Contracts",
    description: "Inspect contracts, schemas, and event history",
    href: "/contracts",
    icon: BracketsCurly,
  },
  {
    title: "Search",
    description: "Look up contract IDs, event IDs, and transaction hashes",
    href: "/search",
    icon: InputSearch,
  },
] as const;

export const naralabsNavItems: NavItem[] = [
  {
    name: "Explore",
    dropdownVariant: "simple",
    childItems: [...NARALABS_EXPLORE_CHILD_ITEMS],
    segments: ["/events", "/contracts", "/search"],
  },
  {
    name: "Schemas",
    href: "/schemas",
    segments: ["/schemas"],
  },
  {
    name: "Playground",
    href: "/playground",
    segments: ["/playground"],
  },
  {
    name: "API",
    href: "/developers",
    segments: ["/developers"],
  },
  {
    name: "Docs",
    href: getDocsUrl(),
    segments: ["/docs"],
  },
];
