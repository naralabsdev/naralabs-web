export function hexToRgb(hex: string): [number, number, number] {
  let value = hex.trim().replace(/^#/, "");
  if (value.length === 3) {
    value = value
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const red = Number.parseInt(value.substring(0, 2), 16) / 255;
  const green = Number.parseInt(value.substring(2, 4), 16) / 255;
  const blue = Number.parseInt(value.substring(4, 6), 16) / 255;

  return [
    Number.isNaN(red) ? 0 : red,
    Number.isNaN(green) ? 0 : green,
    Number.isNaN(blue) ? 0 : blue,
  ];
}

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader;
  }

  gl.deleteShader(shader);
  return null;
}

export function createProgram(
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string,
): WebGLProgram | null {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) return null;

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return program;
  }

  gl.deleteProgram(program);
  return null;
}

export function readGlLimit(
  gl: WebGL2RenderingContext,
  parameter: number,
  fallback: number,
) {
  const value = gl.getParameter(parameter);
  return typeof value === "number" && Number.isFinite(value) && value >= 2
    ? Math.floor(value)
    : fallback;
}

export function readViewportLimit(
  viewportDims: unknown,
  index: number,
  fallback: number,
) {
  if (
    viewportDims instanceof Int32Array ||
    viewportDims instanceof Uint32Array ||
    viewportDims instanceof Float32Array
  ) {
    const value = viewportDims[index];
    if (typeof value === "number" && Number.isFinite(value) && value >= 2) {
      return Math.floor(value);
    }
  }

  return fallback;
}
