"use client";

import { json } from "@codemirror/lang-json";
import type { Extension } from "@codemirror/state";
import { EditorView, ViewPlugin, type ViewUpdate } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/shared/lib/cn";

import "./playground-editor-scroll.css";

function syncContentToViewport(view: EditorView) {
  const height = view.scrollDOM.clientHeight;
  if (height <= 0) {
    return;
  }
  const minHeight = `${height}px`;
  if (view.contentDOM.style.minHeight !== minHeight) {
    view.contentDOM.style.minHeight = minHeight;
  }
  const gutters = view.dom.querySelector(".cm-gutters") as HTMLElement | null;
  if (gutters && gutters.style.minHeight !== minHeight) {
    gutters.style.minHeight = minHeight;
  }
}

/** Stretch editable area to full pane so clicks below the last line still focus the editor. */
const fillEditorViewport = ViewPlugin.fromClass(
  class {
    constructor(readonly view: EditorView) {
      queueMicrotask(() => syncContentToViewport(this.view));
    }

    update(update: ViewUpdate) {
      if (update.geometryChanged || update.docChanged || update.viewportChanged) {
        syncContentToViewport(this.view);
      }
    }
  },
);

const playgroundEditorLayout = EditorView.theme({
  "&": {
    height: "100%",
    fontSize: "13px",
  },
  ".cm-editor": {
    height: "100%",
  },
  ".cm-scroller": {
    height: "100%",
    overflow: "auto",
    fontFamily:
      'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    lineHeight: "1.55",
  },
  ".cm-gutters": {
    backgroundColor: "#1e1e1e",
    borderRight: "1px solid #333",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "#2a2d2e",
  },
});

const clickEmptyAreaToFocus = EditorView.domEventHandlers({
  mousedown(event, view) {
    if (!view.state.facet(EditorView.editable)) {
      return false;
    }
    const pos = view.posAtCoords({ x: event.clientX, y: event.clientY }, false);
    if (pos !== null) {
      return false;
    }
    event.preventDefault();
    const end = view.state.doc.length;
    view.dispatch({
      selection: { anchor: end },
      scrollIntoView: true,
    });
    view.focus();
    return true;
  },
});

function usePlaygroundEditorExtensions(readOnly?: boolean): Extension[] {
  return useMemo(
    () => [
      json(),
      EditorView.lineWrapping,
      playgroundEditorLayout,
      fillEditorViewport,
      ...(readOnly ? [] : [clickEmptyAreaToFocus]),
    ],
    [readOnly],
  );
}

export function PlaygroundCodePane({
  value,
  onChange,
  readOnly,
  placeholder,
}: {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [editorHeight, setEditorHeight] = useState(0);

  const syncHeight = useCallback(() => {
    const el = containerRef.current;
    if (!el) {
      return;
    }
    const next = Math.floor(el.getBoundingClientRect().height);
    if (next <= 0) {
      return;
    }
    setEditorHeight((prev) => (prev === next ? prev : next));
  }, []);

  useEffect(() => {
    syncHeight();
    const el = containerRef.current;
    if (!el) {
      return;
    }
    const observer = new ResizeObserver(() => syncHeight());
    observer.observe(el);
    return () => observer.disconnect();
  }, [syncHeight]);

  const extensions = usePlaygroundEditorExtensions(readOnly);

  return (
    <div
      ref={containerRef}
      className={cn(
        "playground-code-pane min-h-0 flex-1 overflow-hidden bg-[#1e1e1e]",
        "[&_.cm-editor]:!h-full [&_.cm-editor]:!max-h-none",
        "[&>div]:!h-full [&>div]:!max-h-none",
      )}
    >
      {editorHeight > 0 ? (
        <CodeMirror
          value={value}
          height={`${editorHeight}px`}
          theme={vscodeDark}
          extensions={extensions}
          editable={!readOnly}
          placeholder={placeholder}
          onChange={onChange}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: !readOnly,
            highlightActiveLineGutter: !readOnly,
            bracketMatching: true,
            indentOnInput: !readOnly,
            autocompletion: false,
          }}
        />
      ) : null}
    </div>
  );
}
