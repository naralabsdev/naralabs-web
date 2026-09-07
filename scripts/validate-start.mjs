#!/usr/bin/env node
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { setTimeout as delay } from "node:timers/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.VALIDATE_PORT ?? 3099);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BUILD_ID = path.join(ROOT, ".next/BUILD_ID");
const READY_PATTERN = /Local:\s+http/i;
const TIMEOUT_MS = 30_000;

async function main() {
  if (!existsSync(BUILD_ID)) {
    throw new Error("Missing .next build — run `npm run build` first");
  }

  console.log(`Starting production server on port ${PORT}...`);

  const child = spawn("npx", ["next", "start", "-p", String(PORT)], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
    env: process.env,
  });

  let output = "";

  const onData = (chunk) => {
    const text = chunk.toString();
    output += text;
    process.stdout.write(text);
  };

  child.stdout.on("data", onData);
  child.stderr.on("data", onData);

  try {
    const started = Date.now();

    while (Date.now() - started < TIMEOUT_MS) {
      if (child.exitCode !== null) {
        throw new Error(`Production server exited with code ${child.exitCode}`);
      }

      if (READY_PATTERN.test(output)) {
        break;
      }

      await delay(200);
    }

    if (!READY_PATTERN.test(output)) {
      throw new Error(`Production server did not become ready within ${TIMEOUT_MS}ms`);
    }

    await delay(300);

    const response = await fetch(`http://127.0.0.1:${PORT}/`, { redirect: "manual" });
    const body = await response.text();

    if (response.status !== 200) {
      throw new Error(`GET / returned ${response.status}`);
    }

    if (body.includes("CssSyntaxError") || body.includes("Can't resolve")) {
      throw new Error("Server rendered a CSS resolution error on /");
    }

    console.log("Production server smoke test passed (GET / → 200)");
  } finally {
    child.kill("SIGTERM");
    await delay(300);
  }
}

main().catch((error) => {
  console.error("\nServer validation failed:", error.message);
  process.exit(1);
});
