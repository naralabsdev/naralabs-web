export const VERTEX_SHADER = `#version 300 es
precision highp float;
layout(location=0) in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

export const BLUR_SHADER = `#version 300 es
precision mediump float;
uniform sampler2D tex0;
uniform vec2 resolution;
uniform float offset;
uniform float vMult;
uniform float hMult;
in vec2 v_uv;
out vec4 outColor;

void main() {
  vec2 texel = 1.0 / resolution;
  float vOffset = offset * vMult;
  float hOffset = offset * hMult;
  vec4 sum = vec4(0.0);
  sum += texture(tex0, v_uv + vec2(-hOffset, -vOffset) * texel);
  sum += texture(tex0, v_uv + vec2(hOffset, -vOffset) * texel);
  sum += texture(tex0, v_uv + vec2(-hOffset, vOffset) * texel);
  sum += texture(tex0, v_uv + vec2(hOffset, vOffset) * texel);
  outColor = sum * 0.25;
}`;

export const HORIZONTAL_BLUR_SHADER = `#version 300 es
precision mediump float;
uniform sampler2D tex0;
uniform vec2 resolution;
uniform float hRadius;
in vec2 v_uv;
out vec4 outColor;

void main() {
  float rPx = max(hRadius, 0.0);
  if (rPx <= 0.0) {
    outColor = texture(tex0, v_uv);
    return;
  }
  vec2 texel = 1.0 / resolution;
  float sigma = rPx / 3.0;
  int samples = min(int(rPx * 0.5), 16);
  vec4 sum = vec4(0.0);
  float wsum = 0.0;
  for (int i = -16; i <= 16; i++) {
    if (abs(i) <= samples) {
      float dist = float(i);
      float w = exp(-0.5 * (dist * dist) / (sigma * sigma));
      sum += texture(tex0, v_uv + vec2(dist * texel.x, 0.0)) * w;
      wsum += w;
    }
  }
  outColor = sum / max(wsum, 1e-6);
}`;

export const COMPOSITE_SHADER = `#version 300 es
precision mediump float;
uniform sampler2D tex0;
uniform vec2 dstResolution;
uniform float noiseAmp;
uniform float time;
uniform float seed;
uniform float colorMapOn;
uniform float colorSpeed;
uniform vec3 colorA;
uniform vec3 colorB;
in vec2 v_uv;
out vec4 outColor;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float tri01(float x) {
  float f = fract(x);
  return 1.0 - abs(f * 2.0 - 1.0);
}

void main() {
  vec3 col = texture(tex0, v_uv).rgb;
  vec2 ditherCoord = v_uv * dstResolution.xy + seed * 0.1;
  col += vec3((hash(ditherCoord) - 0.5) / 170.0);

  if (noiseAmp > 0.0) {
    float rateX = 4.0;
    float rateY = 3.0;
    vec2 noiseCoord = v_uv * dstResolution.xy * 4.0 + vec2(time * rateX, -time * rateY);
    float n = noise(noiseCoord + seed * 10.0);
    n += noise(noiseCoord * 2.0 + seed * 20.0) * 0.5;
    n /= 1.5;
    col += (n - 0.5) * 2.0 * noiseAmp;
  }

  if (colorMapOn > 0.5) {
    float phase = time / max(colorSpeed, 0.001);
    float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
    float t = tri01(l * 1.75 + phase);
    col = mix(colorA, colorB, t);
  }

  outColor = vec4(col, 1.0);
}`;
