"use client";

import { useState } from "react";

import { CliCommandBlock } from "@/modules/registry/components/cli-command-block";
import { TabSelect } from "@/shared/ui/tab-select";

const PACKAGE_MANAGERS = ["npm", "yarn", "pnpm", "bun"] as const;

type PackageManager = (typeof PACKAGE_MANAGERS)[number];

const INSTALL_COMMANDS: Record<PackageManager, string> = {
  npm: "npm i -g @naralabs/cli",
  yarn: "yarn global add @naralabs/cli",
  pnpm: "pnpm add -g @naralabs/cli",
  bun: "bun add -g @naralabs/cli",
};

export function PackageManagerInstall() {
  const [manager, setManager] = useState<PackageManager>("npm");

  return (
    <div>
      <TabSelect
        variant="accent"
        className="border-b border-neutral-100 px-1"
        selected={manager}
        onSelect={(id: PackageManager) => setManager(id)}
        options={PACKAGE_MANAGERS.map((id) => ({ id, label: id }))}
      />
      <div className="pt-3">
        <CliCommandBlock command={INSTALL_COMMANDS[manager]} />
      </div>
    </div>
  );
}
