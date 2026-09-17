"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/shared/lib/cn";

export type DicebearAvatarStyle = "waves" | "triangles";

const loadedAvatarUrls = new Set<string>();

function getDicebearAvatarUrl(seed: string, style: DicebearAvatarStyle) {
  const params = new URLSearchParams({
    seed,
    size: "56",
    borderRadius: "50",
  });

  return `https://api.dicebear.com/10.x/${style}/svg?${params.toString()}`;
}

function hashSeed(seed: string) {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = seed.charCodeAt(index) + ((hash << 5) - hash);
  }

  return Math.abs(hash);
}

function seedToPlaceholderStyle(seed: string): React.CSSProperties {
  const hash = hashSeed(seed);
  const hueA = hash % 360;
  const hueB = (hash * 7 + 40) % 360;

  return {
    background: `linear-gradient(135deg, hsl(${hueA} 52% 82%) 0%, hsl(${hueB} 38% 68%) 100%)`,
  };
}

function isImageReady(img: HTMLImageElement) {
  if (!img.complete) {
    return false;
  }

  if (img.naturalWidth > 0 || img.naturalHeight > 0) {
    return true;
  }

  // Dicebear SVGs can report 0 intrinsic size even when rendered.
  return /\/svg(?:\?|$)/i.test(img.currentSrc || img.src);
}

export function DicebearAvatar({
  seed,
  style = "waves",
  className,
}: {
  seed: string;
  style?: DicebearAvatarStyle;
  className?: string;
}) {
  const url = getDicebearAvatarUrl(seed, style);
  const [loaded, setLoaded] = useState(() => loadedAvatarUrls.has(url));
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const markLoaded = useCallback(() => {
    loadedAvatarUrls.add(url);
    setLoaded(true);
    setFailed(false);
  }, [url]);

  const syncLoadedState = useCallback(() => {
    const img = imgRef.current;
    if (img && isImageReady(img)) {
      markLoaded();
    }
  }, [markLoaded]);

  useEffect(() => {
    if (loaded) {
      return;
    }

    syncLoadedState();
  }, [loaded, url, syncLoadedState]);

  useEffect(() => {
    if (loaded) {
      return;
    }

    const timeout = window.setTimeout(syncLoadedState, 150);
    return () => window.clearTimeout(timeout);
  }, [loaded, url, syncLoadedState]);

  const handleImageRef = (node: HTMLImageElement | null) => {
    imgRef.current = node;

    if (node && isImageReady(node)) {
      markLoaded();
    }
  };

  const showPlaceholder = !loaded || failed;

  return (
    <span
      className={cn(
        "relative inline-flex size-7 shrink-0 overflow-hidden rounded-full bg-neutral-100",
        className,
      )}
      aria-hidden
    >
      <span
        className={cn(
          "absolute inset-0 scale-110 blur-[2px] transition-opacity duration-300 ease-out",
          showPlaceholder ? "opacity-100" : "opacity-0",
        )}
        style={seedToPlaceholderStyle(seed)}
      />

      {!failed ? (
        <img
          ref={handleImageRef}
          src={url}
          alt=""
          draggable={false}
          decoding="async"
          onLoad={markLoaded}
          onError={() => {
            setFailed(true);
            setLoaded(false);
          }}
          className={cn(
            "relative size-full rounded-full object-cover transition-[filter,opacity,transform] duration-300 ease-out",
            loaded
              ? "scale-100 opacity-100 blur-0"
              : "scale-105 opacity-80 blur-md",
          )}
        />
      ) : null}
    </span>
  );
}
