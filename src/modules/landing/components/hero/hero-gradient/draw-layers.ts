type LayerOffsets = {
  backOffX: number;
  backOffY: number;
  midOffX: number;
  midOffY: number;
  frontOffX: number;
  frontOffY: number;
};

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function drawCurtainLayer(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rand: () => number,
  fillStyle: string,
  pointCount: number,
  heightFactor: number,
  waveAmplitude: number,
  gradientBoost: boolean,
  gradientStrength: number,
  offsetX: number,
  yScale: number,
  offsetY: number,
  baseYOffset: number,
) {
  ctx.fillStyle = fillStyle;

  const halfSpan = (yScale - 1) * 0.5 * width;
  const left = -halfSpan + offsetX;
  const right = width + halfSpan + offsetX;
  const baseline = height - baseYOffset + offsetY;
  const points: [number, number][] = [];

  for (let index = 0; index < pointCount; index += 1) {
    const t = pointCount === 1 ? 0 : index / (pointCount - 1);
    const x = left + (right - left) * t;
    let peak =
      (0.35 * Math.pow(2 * Math.abs(0.5 - t), 0.8 + 0.8 * rand()) +
        0.65 * (rand() * (0.6 + 0.4 * rand()))) *
      heightFactor *
      height;

    if (gradientBoost) {
      peak *= 1 + gradientStrength * t;
    }

    points.push([x, baseline - peak]);
  }

  const waveHeight = waveAmplitude * height;
  const bottom = height + 2;

  ctx.beginPath();
  ctx.moveTo(left, baseline - rand() * waveHeight);
  for (const [x, y] of points) {
    ctx.lineTo(x, y);
  }
  ctx.lineTo(right, baseline - rand() * waveHeight);
  ctx.lineTo(right, bottom);
  ctx.lineTo(left, bottom);
  ctx.closePath();
  ctx.fill();
}

export function drawGradientLayers(
  canvas: HTMLCanvasElement,
  seed: number,
  middlePoints: number,
  offsets: LayerOffsets,
  displayWidth: number,
  displayHeight: number,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const rand = mulberry32(seed);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  const scaleX = width / displayWidth;
  const scaleY = height / displayHeight;
  const baseYOffset = 0;

  drawCurtainLayer(
    ctx,
    width,
    height,
    rand,
    "#1e1e1e",
    11,
    0.8,
    0.12,
    false,
    0,
    offsets.backOffX * scaleX,
    1.2,
    offsets.backOffY * scaleY,
    baseYOffset,
  );

  drawCurtainLayer(
    ctx,
    width,
    height,
    rand,
    "#545454",
    middlePoints,
    0.68,
    0.1,
    true,
    0.8,
    offsets.midOffX * scaleX,
    1.8,
    offsets.midOffY * scaleY,
    baseYOffset,
  );

  drawCurtainLayer(
    ctx,
    width,
    height,
    rand,
    "#a8a8a8",
    7,
    0.58,
    0.08,
    false,
    0,
    offsets.frontOffX * scaleX,
    2.2,
    offsets.frontOffY * scaleY,
    baseYOffset,
  );
}

export type { LayerOffsets };
