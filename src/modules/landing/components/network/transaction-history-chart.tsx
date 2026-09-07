type TransactionHistoryChartProps = {
  data: number[];
  startLabel?: string;
  endLabel?: string;
};

export function TransactionHistoryChart({
  data,
  startLabel,
  endLabel,
}: TransactionHistoryChartProps) {
  const width = 280;
  const height = 72;
  const padding = 2;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = padding + (index / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="flex h-full flex-col">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full flex-1"
        preserveAspectRatio="none"
        aria-hidden
      >
        <polyline
          fill="url(#networkChartFill)"
          stroke="none"
          points={`${padding},${height - padding} ${points} ${width - padding},${height - padding}`}
        />
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />
        <defs>
          <linearGradient id="networkChartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      {startLabel && endLabel ? (
        <div className="mt-0.5 flex justify-between text-[10px] text-neutral-400">
          <span>{startLabel}</span>
          <span>{endLabel}</span>
        </div>
      ) : null}
    </div>
  );
}
