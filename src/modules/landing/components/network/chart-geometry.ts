export type ChartPoint = {
  index: number;
  x: number;
  y: number;
  value: number;
  label: string;
};

export function buildChartPoints(
  data: number[],
  labels: string[],
  width: number,
  height: number,
  padding: number,
  min: number,
  max: number,
): ChartPoint[] {
  const range = max - min || 1;

  return data.map((value, index) => {
    const x =
      data.length <= 1
        ? width / 2
        : padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);

    return {
      index,
      x,
      y,
      value,
      label: labels[index] ?? `#${index + 1}`,
    };
  });
}

export function buildChartPaths(
  points: ChartPoint[],
  width: number,
  height: number,
  padding: number,
) {
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const fill = `${padding},${height - padding} ${line} ${width - padding},${height - padding}`;

  return { line, fill };
}

export function resolveNearestPointIndex(
  clientX: number,
  rect: DOMRect,
  pointCount: number,
  width: number,
  padding: number,
) {
  if (pointCount <= 0) {
    return null;
  }

  if (pointCount === 1) {
    return 0;
  }

  const relativeX = clientX - rect.left;
  const normalizedX = (relativeX / rect.width) * width;
  const plotWidth = width - padding * 2;
  const ratio = (normalizedX - padding) / plotWidth;
  const index = Math.round(ratio * (pointCount - 1));

  return Math.max(0, Math.min(pointCount - 1, index));
}
