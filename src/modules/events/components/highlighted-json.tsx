"use client";

import { cn } from "@/shared/lib/cn";
import { CopyFeedbackButton } from "@/shared/ui/copy-feedback-button";
import type { ReactNode } from "react";

type JsonTokenType = "key" | "string" | "number" | "boolean" | "null" | "punctuation";

type JsonToken = {
  type: JsonTokenType;
  value: string;
};

const tokenClass: Record<JsonTokenType, string> = {
  key: "text-[#0451a5]",
  string: "text-[#a31515]",
  number: "text-[#098658]",
  boolean: "text-[#0550ae]",
  null: "text-[#0550ae]",
  punctuation: "text-neutral-700",
};

function tokenizeJsonLine(line: string): JsonToken[] {
  const tokens: JsonToken[] = [];
  let index = 0;

  while (index < line.length) {
    const char = line[index]!;

    if (char === '"') {
      let cursor = index + 1;
      while (cursor < line.length) {
        if (line[cursor] === "\\") {
          cursor += 2;
          continue;
        }
        if (line[cursor] === '"') {
          cursor += 1;
          break;
        }
        cursor += 1;
      }

      const literal = line.slice(index, cursor);
      let lookahead = cursor;
      while (lookahead < line.length && line[lookahead] === " ") {
        lookahead += 1;
      }

      tokens.push({
        type: line[lookahead] === ":" ? "key" : "string",
        value: literal,
      });
      index = cursor;
      continue;
    }

    if (/[-0-9]/.test(char)) {
      let cursor = index + 1;
      while (cursor < line.length && /[0-9.eE+-]/.test(line[cursor]!)) {
        cursor += 1;
      }
      tokens.push({ type: "number", value: line.slice(index, cursor) });
      index = cursor;
      continue;
    }

    if (line.startsWith("true", index) || line.startsWith("false", index)) {
      const word = line.startsWith("true", index) ? "true" : "false";
      tokens.push({ type: "boolean", value: word });
      index += word.length;
      continue;
    }

    if (line.startsWith("null", index)) {
      tokens.push({ type: "null", value: "null" });
      index += 4;
      continue;
    }

    if ("[]{}:,".includes(char)) {
      tokens.push({ type: "punctuation", value: char });
      index += 1;
      continue;
    }

    tokens.push({ type: "punctuation", value: char });
    index += 1;
  }

  return tokens;
}

function highlightJsonLine(line: string): ReactNode {
  const indent = line.match(/^\s*/)?.[0] ?? "";
  const content = line.slice(indent.length);

  if (!content) {
    return indent || "\u00a0";
  }

  const tokens = tokenizeJsonLine(content);

  return (
    <>
      {indent}
      {tokens.map((token, index) => (
        <span key={`${index}-${token.value}`} className={tokenClass[token.type]}>
          {token.value}
        </span>
      ))}
    </>
  );
}

export function HighlightedJson({ code }: { code: string }) {
  const lines = code.split("\n");
  const lineNumberWidth = Math.max(2, String(lines.length).length);

  return (
    <div className="px-5 py-4 sm:px-6 sm:py-5">
      <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
        <CopyFeedbackButton
          value={code}
          label="Copy XDR JSON"
          successMessage="Copied XDR JSON"
          className="absolute right-3 top-3 z-10 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-600 shadow-sm transition-colors hover:border-neutral-300 hover:text-neutral-900"
          copiedClassName="border-emerald-200 bg-emerald-50 text-emerald-700 hover:text-emerald-700"
        >
          Copy
        </CopyFeedbackButton>

        <div className="flex overflow-x-auto">
          <div
            className="select-none shrink-0 border-r border-neutral-200 bg-neutral-100 px-3 py-4 font-mono text-[12px] leading-6 text-neutral-400"
            aria-hidden
          >
            {lines.map((_, index) => (
              <div key={index} className="tabular-nums">
                {String(index + 1).padStart(lineNumberWidth, " ")}
              </div>
            ))}
          </div>

          <pre className="min-w-0 flex-1 overflow-x-auto bg-white p-4 pr-24 font-mono text-[13px] leading-6 text-neutral-800">
            <code>
              {lines.map((line, index) => (
                <div
                  key={index}
                  className={cn("whitespace-pre-wrap break-all", index === lines.length - 1 && !line && "hidden")}
                >
                  {highlightJsonLine(line)}
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
