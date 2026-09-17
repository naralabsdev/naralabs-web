"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import { AnimatedText } from "@/shared/ui/animated-text";
import { cn } from "@/shared/lib/cn";

import {
  buildChartPaths,
  buildChartPoints,
  resolveNearestPointIndex,
} from "./chart-geometry";
import { useAnimatedChartSeries } from "./use-animated-chart-series";

type TransactionHistoryChartProps = {
  data: number[];
  labels?: string[];
  startLabel?: string;
  endLabel?: string;
};

const CHART_WIDTH = 280;
const CHART_HEIGHT = 72;
const CHART_PADDING = 2;

export function TransactionHistoryChart({
  data,
  labels = [],
  startLabel,
  endLabel,
}: TransactionHistoryChartProps) {
  const chartAreaRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const animated = useAnimatedChartSeries(data);

  const resolvedLabels = useMemo(() => {
    if (labels.length >= data.length) {
      return labels.slice(0, data.length);
    }

    return data.map((_, index) => labels[index] ?? `#${index + 1}`);
  }, [data, labels]);

  const points = useMemo(
    () =>
      buildChartPoints(
        animated.data,
        resolvedLabels,
        CHART_WIDTH,
        CHART_HEIGHT,
        CHART_PADDING,
        animated.min,
        animated.max,
      ),
    [animated.data, animated.max, animated.min, resolvedLabels],
  );

  const { line, fill } = useMemo(
    () => buildChartPaths(points, CHART_WIDTH, CHART_HEIGHT, CHART_PADDING),
    [points],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const rect = chartAreaRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      setHoveredIndex(
        resolveNearestPointIndex(
          event.clientX,
          rect,
          points.length,
          CHART_WIDTH,
          CHART_PADDING,
        ),
      );
    },
    [points.length],
  );

  const handlePointerLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  const activePoint = hoveredIndex == null ? null : points[hoveredIndex];

  return (
    <div className="flex h-full flex-col">
      <div
        ref={chartAreaRef}
        className="relative flex-1 touch-none cursor-crosshair"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          className="h-full w-full"
          preserveAspectRatio="none"
          role="img"
          aria-label="Event activity chart"
        >
          <defs>
            <linearGradient id="networkChartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>

          <polyline fill="url(#networkChartFill)" stroke="none" points={fill} />
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={line}
          />

          {activePoint ? (
            <line
              x1={activePoint.x}
              x2={activePoint.x}
              y1={CHART_PADDING}
              y2={CHART_HEIGHT - CHART_PADDING}
              stroke="#93c5fd"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity={0.85}
            />
          ) : null}

          {activePoint ? (
            <circle
              cx={activePoint.x}
              cy={activePoint.y}
              r={3.5}
              fill="#2563eb"
              stroke="#ffffff"
              strokeWidth={1.75}
              className="pointer-events-none"
            />
          ) : null}
        </svg>

        {activePoint ? (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-900 px-2 py-1 text-[10px] leading-none text-white shadow-[0_8px_20px_rgba(0,0,0,0.18)]"
            style={{
              left: `${(activePoint.x / CHART_WIDTH) * 100}%`,
              top: `calc(${(activePoint.y / CHART_HEIGHT) * 100}% - 28px)`,
            }}
          >
            <span className="font-medium text-white">{activePoint.label}</span>
            <span className="text-neutral-400"> · </span>
            <span className="text-neutral-200">
              {Math.round(data[activePoint.index] ?? activePoint.value).toLocaleString()}{" "}
              events
            </span>
          </div>
        ) : null}

        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-md transition-colors duration-150",
            hoveredIndex != null ? "bg-blue-500/[0.03]" : "bg-transparent",
          )}
          aria-hidden
        />
      </div>

      {startLabel && endLabel ? (
        <div className="mt-0.5 flex justify-between text-[10px] text-neutral-400">
          <AnimatedText value={startLabel} />
          <AnimatedText value={endLabel} />
        </div>
      ) : null}
    </div>
  );
}
