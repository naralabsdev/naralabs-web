"use client";

import type { SchemaProjectDetail } from "@/modules/registry/types";
import { CliCommandBlock } from "@/modules/registry/components/cli-command-block";
import { PackageManagerInstall } from "@/modules/registry/components/package-manager-install";

function maskToken(token: string) {
  const prefix = token.slice(0, 12);
  return `${prefix}${"•".repeat(Math.max(token.length - 12, 8))}`;
}

export function SchemaGettingStarted({ project }: { project: SchemaProjectDetail }) {
  const folder = project.slug;
  const authCommand = `naralabs auth ${project.publishToken}`;
  const initCommand = `naralabs init ${folder}`;
  const cdCommand = `cd ${folder}`;
  const validateCommand = "naralabs registry validate";
  const publishCommand = "naralabs registry publish";

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-medium text-neutral-900">1. Install NaraLabs CLI</p>
        <div className="mt-3">
          <PackageManagerInstall />
        </div>
      </section>

      <section>
        <p className="text-sm font-medium text-neutral-900">2. Initialize schema</p>
        <p className="mt-1 text-sm text-neutral-500">
          Verifies your contract and writes <code className="text-xs">naralabs.schema.yaml</code>.
          Edit event topics and params to match what your contract emits on-chain.
        </p>
        <div className="mt-3">
          <CliCommandBlock command={initCommand} />
        </div>
      </section>

      <section>
        <p className="text-sm font-medium text-neutral-900">3. Edit schema</p>
        <p className="mt-1 text-sm text-neutral-500">
          Map <code className="text-xs">prefix_topics</code> and{" "}
          <code className="text-xs">params</code> in{" "}
          <code className="text-xs">naralabs.schema.yaml</code> before publish.
        </p>
      </section>

      <section>
        <p className="text-sm font-medium text-neutral-900">4. Authenticate &amp; deploy</p>
        <div className="mt-3 space-y-3">
          <CliCommandBlock
            command={authCommand}
            maskedCommand={`naralabs auth ${maskToken(project.publishToken)}`}
            copyValue={authCommand}
          />
          <CliCommandBlock command={cdCommand} />
          <CliCommandBlock command={validateCommand} />
          <CliCommandBlock command={publishCommand} />
        </div>
      </section>
    </div>
  );
}
