"use client";

import { useEffect, useRef, useState } from "react";

const CHART_ANIMATION_MS = 650;

function easeOutSmooth(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

function getScale(data: number[]) {
  if (data.length === 0) {
    return { min: 0, max: 1 };
  }

  const min = Math.min(...data);
  const max = Math.max(...data);

  if (min === max) {
    return { min: 0, max: max || 1 };
  }

  return { min, max };
}

function interpolateSeries(from: number[], to: number[], progress: number) {
  const length = Math.max(from.length, to.length);

  return Array.from({ length }, (_, index) => {
    const start = from[index] ?? to[index] ?? 0;
    const end = to[index] ?? from[index] ?? 0;
    return start + (end - start) * progress;
  });
}

function seriesEqual(left: number[], right: number[]) {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((value, index) => value === right[index]);
}

export type AnimatedChartSeries = {
  data: number[];
  min: number;
  max: number;
};

export function useAnimatedChartSeries(source: number[]): AnimatedChartSeries {
  const [state, setState] = useState<AnimatedChartSeries>(() => ({
    data: source,
    ...getScale(source),
  }));
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (seriesEqual(stateRef.current.data, source)) {
      return;
    }

    const fromSeries = stateRef.current.data;
    const fromScale = { min: stateRef.current.min, max: stateRef.current.max };
    const toScale = getScale(source);
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / CHART_ANIMATION_MS);
      const eased = easeOutSmooth(progress);

      setState({
        data: interpolateSeries(fromSeries, source, eased),
        min: fromScale.min + (toScale.min - fromScale.min) * eased,
        max: fromScale.max + (toScale.max - fromScale.max) * eased,
      });

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [source]);

  return state;
}
