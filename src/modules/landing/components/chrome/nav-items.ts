"use client";

import {
  Bolt,
  BracketsCurly,
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
] as const;

export const naralabsNavItems: NavItem[] = [
  {
    name: "Explore",
    dropdownVariant: "simple",
    childItems: [...NARALABS_EXPLORE_CHILD_ITEMS],
    segments: ["/events", "/contracts"],
  },
  {
    name: "Schemas",
    href: "/schemas",
    segments: ["/schemas"],
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
    target: "_blank",
    external: true,
  },
];
