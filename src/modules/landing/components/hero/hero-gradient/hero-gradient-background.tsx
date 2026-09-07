"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { drawGradientLayers, type LayerOffsets } from "@/modules/landing/components/hero/hero-gradient/draw-layers";
import {
  BLUR_SHADER,
  COMPOSITE_SHADER,
  HORIZONTAL_BLUR_SHADER,
  VERTEX_SHADER,
} from "@/modules/landing/components/hero/hero-gradient/shaders";
import {
  createProgram,
  hexToRgb,
  readGlLimit,
  readViewportLimit,
} from "@/modules/landing/components/hero/hero-gradient/webgl-utils";

const COLOR_A = "#0c1a33";
const COLOR_B = "#1BA374";
const SEED = 3920;
const VERTICAL_BLUR_OFFSETS = [0.4, 0.7, 1, 1.3, 1.6];
const UPSCALE_BLUR_OFFSETS = [1.6, 1.3, 1, 0.7];

type HeroGradientBackgroundProps = {
  className?: string;
  onReady?: () => void;
};

type RuntimeState = {
  dynBlurScale: number;
  isVisible: boolean;
  lastDrawnBackX: number;
  lastDrawnBackY: number;
  lastDrawnMidX: number;
  lastDrawnMidY: number;
  lastDrawnFrontX: number;
  lastDrawnFrontY: number;
  frameSkipCounter: number;
};

type AnimatedOffsets = LayerOffsets & {
  backTX: number;
  backTY: number;
  midTX: number;
  midTY: number;
  frontTX: number;
  frontTY: number;
};

function createTexture(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  maxTextureSize: number,
) {
  const textureWidth = Math.min(width, maxTextureSize);
  const textureHeight = Math.min(height, maxTextureSize);
  const texture = gl.createTexture();
  if (!texture) return null;

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, textureWidth, textureHeight);
  gl.bindTexture(gl.TEXTURE_2D, null);

  return texture;
}

function createFramebuffer(gl: WebGL2RenderingContext, texture: WebGLTexture) {
  const framebuffer = gl.createFramebuffer();
  if (!framebuffer) return null;

  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0,
  );

  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  return status === gl.FRAMEBUFFER_COMPLETE ? framebuffer : null;
}

export function HeroGradientBackground({ className, onReady }: HeroGradientBackgroundProps) {
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const sourceCanvasRef = useRef<HTMLCanvasElement>(null);
  const offsetsRef = useRef<AnimatedOffsets>({
    backOffX: 0,
    backOffY: 0,
    backTX: 0,
    backTY: 0,
    midOffX: 0,
    midOffY: 0,
    midTX: 0,
    midTY: 0,
    frontOffX: 0,
    frontOffY: 0,
    frontTX: 0,
    frontTY: 0,
  });
  const runtimeRef = useRef<RuntimeState>({
    dynBlurScale: 0.5,
    isVisible: true,
    lastDrawnBackX: 0,
    lastDrawnBackY: 0,
    lastDrawnMidX: 0,
    lastDrawnMidY: 0,
    lastDrawnFrontX: 0,
    lastDrawnFrontY: 0,
    frameSkipCounter: 0,
  });
  const [isReady, setIsReady] = useState(false);
  const readyRef = useRef(false);
  const [webglSupported, setWebglSupported] = useState(true);

  const markReady = () => {
    if (readyRef.current) return;
    readyRef.current = true;
    setIsReady(true);
    onReady?.();
  };

  useEffect(() => {
    if (!webglSupported) {
      markReady();
    }
  }, [webglSupported]);

  const colors = useMemo(
    () => ({
      colorARgb: hexToRgb(COLOR_A),
      colorBRgb: hexToRgb(COLOR_B),
    }),
    [],
  );

  useEffect(() => {
    const displayCanvas = displayCanvasRef.current;
    const sourceCanvas = sourceCanvasRef.current;
    if (!displayCanvas || !sourceCanvas) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const enableParallax = !prefersReducedMotion && !isMobile;
    const staticFrame = prefersReducedMotion;
    const dprCap = 1.5;
    const verticalBlurRadius = 800;
    const horizontalBlurRadius = isMobile ? 8 : 12;
    const middlePoints = isMobile ? 32 : 36;
    const noiseAmount = 4;
    const colorCycleSpeed = 6;
    const lockSizeAfterInitialLayout = isMobile;

    const gl = displayCanvas.getContext("webgl2", {
      antialias: false,
      premultipliedAlpha: false,
      depth: false,
      stencil: false,
    });

    if (!gl) {
      setWebglSupported(false);
      return;
    }

    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    let animationFrame = 0;
    let running = true;
    let contextLost = false;
    let layoutLocked = false;
    let displayWidth = 0;
    let displayHeight = 0;

    let sourceTexture: WebGLTexture | null = null;
    let horizontalTexture: WebGLTexture | null = null;
    let downTextures: Array<WebGLTexture | null> = [null, null, null, null, null];
    let upTextures: Array<WebGLTexture | null> = [null, null, null, null];
    let downFramebuffers: Array<WebGLFramebuffer | null> = [null, null, null, null, null];
    let upFramebuffers: Array<WebGLFramebuffer | null> = [null, null, null, null];
    let horizontalFramebuffer: WebGLFramebuffer | null = null;

    let blurProgram: WebGLProgram | null = null;
    let upscaleBlurProgram: WebGLProgram | null = null;
    let horizontalBlurProgram: WebGLProgram | null = null;
    let compositeProgram: WebGLProgram | null = null;
    let vertexArray: WebGLVertexArrayObject | null = null;
    let vertexBuffer: WebGLBuffer | null = null;

    const viewportDims = gl.getParameter(gl.MAX_VIEWPORT_DIMS);
    const limits = {
      maxTextureSize: readGlLimit(gl, gl.MAX_TEXTURE_SIZE, 1024),
      maxRenderbufferSize: readGlLimit(gl, gl.MAX_RENDERBUFFER_SIZE, 1024),
      maxViewportWidth: readViewportLimit(viewportDims, 0, 1024),
      maxViewportHeight: readViewportLimit(viewportDims, 1, 1024),
    };

    const bindTextureUnit = (unit: number, texture: WebGLTexture | null) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
    };

    const drawFullscreenTriangle = () => {
      if (!vertexArray) return;
      gl.bindVertexArray(vertexArray);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindVertexArray(null);
    };

    const initPrograms = () => {
      blurProgram = createProgram(gl, VERTEX_SHADER, BLUR_SHADER);
      upscaleBlurProgram = createProgram(gl, VERTEX_SHADER, BLUR_SHADER);
      horizontalBlurProgram = createProgram(gl, VERTEX_SHADER, HORIZONTAL_BLUR_SHADER);
      compositeProgram = createProgram(gl, VERTEX_SHADER, COMPOSITE_SHADER);

      if (!blurProgram || !upscaleBlurProgram || !horizontalBlurProgram || !compositeProgram) {
        return false;
      }

      vertexArray = gl.createVertexArray();
      gl.bindVertexArray(vertexArray);
      vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW,
      );
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, 0);
      gl.bindVertexArray(null);

      return true;
    };

    const runBlurPass = (
      inputTexture: WebGLTexture,
      framebuffer: WebGLFramebuffer,
      width: number,
      height: number,
      offset: number,
      program: WebGLProgram,
    ) => {
      gl.useProgram(program);
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.viewport(0, 0, width, height);
      bindTextureUnit(0, inputTexture);

      gl.uniform1i(gl.getUniformLocation(program, "tex0"), 0);
      gl.uniform2f(gl.getUniformLocation(program, "resolution"), width, height);
      gl.uniform1f(gl.getUniformLocation(program, "offset"), offset);
      gl.uniform1f(gl.getUniformLocation(program, "vMult"), 4);
      gl.uniform1f(gl.getUniformLocation(program, "hMult"), 0.12);
      drawFullscreenTriangle();
    };

    const runHorizontalBlurPass = (
      inputTexture: WebGLTexture,
      framebuffer: WebGLFramebuffer,
      radius: number,
      width: number,
      height: number,
    ) => {
      if (!horizontalBlurProgram) return;

      gl.useProgram(horizontalBlurProgram);
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.viewport(0, 0, width, height);
      bindTextureUnit(0, inputTexture);

      gl.uniform1i(gl.getUniformLocation(horizontalBlurProgram, "tex0"), 0);
      gl.uniform2f(
        gl.getUniformLocation(horizontalBlurProgram, "resolution"),
        width,
        height,
      );
      gl.uniform1f(gl.getUniformLocation(horizontalBlurProgram, "hRadius"), radius);
      drawFullscreenTriangle();
    };

    const runCompositePass = (
      inputTexture: WebGLTexture,
      time: number,
      disableNoise: boolean,
    ) => {
      if (!compositeProgram) return;

      gl.useProgram(compositeProgram);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, displayWidth, displayHeight);
      bindTextureUnit(0, inputTexture);

      gl.uniform1i(gl.getUniformLocation(compositeProgram, "tex0"), 0);
      gl.uniform2f(
        gl.getUniformLocation(compositeProgram, "dstResolution"),
        displayWidth,
        displayHeight,
      );
      gl.uniform1f(
        gl.getUniformLocation(compositeProgram, "noiseAmp"),
        disableNoise ? 0 : noiseAmount / 100,
      );
      gl.uniform1f(gl.getUniformLocation(compositeProgram, "time"), time);
      gl.uniform1f(gl.getUniformLocation(compositeProgram, "seed"), SEED);
      gl.uniform1f(gl.getUniformLocation(compositeProgram, "colorMapOn"), 1);
      gl.uniform1f(gl.getUniformLocation(compositeProgram, "colorSpeed"), colorCycleSpeed);
      gl.uniform3f(
        gl.getUniformLocation(compositeProgram, "colorA"),
        colors.colorARgb[0],
        colors.colorARgb[1],
        colors.colorARgb[2],
      );
      gl.uniform3f(
        gl.getUniformLocation(compositeProgram, "colorB"),
        colors.colorBRgb[0],
        colors.colorBRgb[1],
        colors.colorBRgb[2],
      );
      drawFullscreenTriangle();
    };

    const deleteTextures = () => {
      if (sourceTexture) gl.deleteTexture(sourceTexture);
      if (horizontalTexture) gl.deleteTexture(horizontalTexture);

      downTextures.forEach((texture) => texture && gl.deleteTexture(texture));
      upTextures.forEach((texture) => texture && gl.deleteTexture(texture));
      if (horizontalFramebuffer) gl.deleteFramebuffer(horizontalFramebuffer);
      downFramebuffers.forEach((framebuffer) => framebuffer && gl.deleteFramebuffer(framebuffer));
      upFramebuffers.forEach((framebuffer) => framebuffer && gl.deleteFramebuffer(framebuffer));

      sourceTexture = null;
      horizontalTexture = null;
      downTextures = [];
      upTextures = [];
      downFramebuffers = [];
      upFramebuffers = [];
      horizontalFramebuffer = null;
    };

    const deleteAllResources = () => {
      gl.useProgram(null);
      gl.bindVertexArray(null);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);

      deleteTextures();

      if (vertexBuffer) gl.deleteBuffer(vertexBuffer);
      if (vertexArray) gl.deleteVertexArray(vertexArray);
      if (blurProgram) gl.deleteProgram(blurProgram);
      if (upscaleBlurProgram) gl.deleteProgram(upscaleBlurProgram);
      if (horizontalBlurProgram) gl.deleteProgram(horizontalBlurProgram);
      if (compositeProgram) gl.deleteProgram(compositeProgram);
    };

    const resize = ({ force = false }: { force?: boolean } = {}) => {
      if (lockSizeAfterInitialLayout && layoutLocked && !force) return;

      const rect = displayCanvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      const nextWidth = Math.max(2, Math.floor(rect.width * dpr));
      const nextHeight = Math.max(2, Math.floor(rect.height * dpr));

      displayCanvas.width = Math.min(nextWidth, limits.maxViewportWidth);
      displayCanvas.height = Math.min(nextHeight, limits.maxViewportHeight);
      displayWidth = displayCanvas.width;
      displayHeight = displayCanvas.height;

      const blurWidth = Math.max(
        2,
        Math.min(
          Math.floor(displayWidth * runtimeRef.current.dynBlurScale),
          limits.maxTextureSize,
        ),
      );
      const blurHeight = Math.max(
        2,
        Math.min(
          Math.floor(displayHeight * runtimeRef.current.dynBlurScale),
          limits.maxTextureSize,
        ),
      );

      sourceCanvas.width = blurWidth;
      sourceCanvas.height = blurHeight;

      deleteTextures();

      sourceTexture = createTexture(gl, blurWidth, blurHeight, limits.maxTextureSize);
      horizontalTexture = createTexture(gl, blurWidth, blurHeight, limits.maxTextureSize);

      downTextures = [];
      downFramebuffers = [];
      for (let level = 0; level < 5; level += 1) {
        const width = Math.max(2, Math.floor(blurWidth / 2 ** level));
        const height = Math.max(2, Math.floor(blurHeight / 2 ** level));
        const texture = createTexture(gl, width, height, limits.maxTextureSize);
        downTextures.push(texture);
        downFramebuffers.push(texture ? createFramebuffer(gl, texture) : null);
      }

      upTextures = [];
      upFramebuffers = [];
      for (let level = 0; level < 4; level += 1) {
        const width = Math.max(2, Math.floor(blurWidth / 2 ** (3 - level)));
        const height = Math.max(2, Math.floor(blurHeight / 2 ** (3 - level)));
        const texture = createTexture(gl, width, height, limits.maxTextureSize);
        upTextures.push(texture);
        upFramebuffers.push(texture ? createFramebuffer(gl, texture) : null);
      }

      horizontalFramebuffer =
        horizontalTexture ? createFramebuffer(gl, horizontalTexture) : null;

      gl.viewport(0, 0, displayWidth, displayHeight);

      const offsets = offsetsRef.current;
      offsets.backOffX = 0;
      offsets.backOffY = 0;
      offsets.midOffX = 0;
      offsets.midOffY = 0;
      offsets.frontOffX = 0;
      offsets.frontOffY = 0;
      offsets.backTX = 0;
      offsets.backTY = 0;
      offsets.midTX = 0;
      offsets.midTY = 0;
      offsets.frontTX = 0;
      offsets.frontTY = 0;

      runtimeRef.current.frameSkipCounter = 0;
      if (lockSizeAfterInitialLayout) layoutLocked = true;
    };

    const renderFrame = () => {
      if (!running || contextLost || !sourceTexture) {
        animationFrame = requestAnimationFrame(renderFrame);
        return;
      }

      const runtime = runtimeRef.current;
      if (!runtime.isVisible) {
        running = false;
        return;
      }

      const now = performance.now();
      const offsets = offsetsRef.current;
      const parallaxActive = enableParallax;

      if (runtime.frameSkipCounter % 2 === 0) {
        const time = 0.001 * now;
        const autoShift = 0.003 * displayWidth * Math.sin(2 * Math.PI * 0.08 * time);
        let shiftX = parallaxActive ? autoShift : 0;
        let shiftY = 0;

        const wobbleX = 0.002 * displayWidth;
        const midWobble = Math.sin(2 * Math.PI * 0.0888 * time + 0.7) * wobbleX;
        const frontWobble = Math.sin(2 * Math.PI * 0.1016 * time + 1.3) * wobbleX;

        const backLimitX = (1.2 - 1) * 0.5 * displayWidth;
        const midLimitX = 0.4 * displayWidth;
        const frontLimitX = (2.2 - 1) * 0.5 * displayWidth;
        const backLimitY = (1.2 - 1) * 0.5 * displayHeight;
        const midLimitY = 0.4 * displayHeight;
        const frontLimitY = (2.2 - 1) * 0.5 * displayHeight;

        offsets.backTX = Math.max(-backLimitX, Math.min(backLimitX, -(0.8 * shiftX)));
        offsets.midTX = Math.max(-midLimitX, Math.min(midLimitX, (shiftX + midWobble) * 2.2));
        offsets.frontTX = Math.max(
          -frontLimitX,
          Math.min(frontLimitX, (shiftX + frontWobble) * 4),
        );
        offsets.backTY = Math.max(-backLimitY, Math.min(backLimitY, 0.6 * shiftY));
        offsets.midTY = Math.max(-midLimitY, Math.min(midLimitY, 1.8 * shiftY));
        offsets.frontTY = Math.max(-frontLimitY, Math.min(frontLimitY, 3.2 * shiftY));

        offsets.backOffX += (offsets.backTX - offsets.backOffX) * 0.018;
        offsets.backOffY += (offsets.backTY - offsets.backOffY) * 0.018;
        offsets.midOffX += (offsets.midTX - offsets.midOffX) * 0.02;
        offsets.midOffY += (offsets.midTY - offsets.midOffY) * 0.02;
        offsets.frontOffX += (offsets.frontTX - offsets.frontOffX) * 0.035;
        offsets.frontOffY += (offsets.frontTY - offsets.frontOffY) * 0.035;
      }

      const layerChanged =
        Math.abs(offsets.backOffX - runtime.lastDrawnBackX) > 0.4 ||
        Math.abs(offsets.backOffY - runtime.lastDrawnBackY) > 0.4 ||
        Math.abs(offsets.midOffX - runtime.lastDrawnMidX) > 0.4 ||
        Math.abs(offsets.midOffY - runtime.lastDrawnMidY) > 0.4 ||
        Math.abs(offsets.frontOffX - runtime.lastDrawnFrontX) > 0.4 ||
        Math.abs(offsets.frontOffY - runtime.lastDrawnFrontY) > 0.4 ||
        runtime.frameSkipCounter === 0;

      if (layerChanged) {
        drawGradientLayers(
          sourceCanvas,
          SEED,
          middlePoints,
          offsets,
          displayWidth,
          displayHeight,
        );

        gl.bindTexture(gl.TEXTURE_2D, sourceTexture);
        gl.texSubImage2D(
          gl.TEXTURE_2D,
          0,
          0,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          sourceCanvas,
        );
        gl.bindTexture(gl.TEXTURE_2D, null);

        runtime.lastDrawnBackX = offsets.backOffX;
        runtime.lastDrawnBackY = offsets.backOffY;
        runtime.lastDrawnMidX = offsets.midOffX;
        runtime.lastDrawnMidY = offsets.midOffY;
        runtime.lastDrawnFrontX = offsets.frontOffX;
        runtime.lastDrawnFrontY = offsets.frontOffY;
      }

      runtime.frameSkipCounter += 1;

      let currentTexture = sourceTexture;
      const blurWidth = sourceCanvas.width;
      const blurHeight = sourceCanvas.height;

      if (verticalBlurRadius > 0 && blurProgram && upscaleBlurProgram) {
        for (const [index, offset] of VERTICAL_BLUR_OFFSETS.entries()) {
          const inputTexture = index === 0 ? currentTexture : downTextures[index - 1];
          const outputTexture = downTextures[index];
          const framebuffer = downFramebuffers[index];
          if (!inputTexture || !outputTexture || !framebuffer) continue;

          const width = Math.max(2, Math.floor(blurWidth / 2 ** index));
          const height = Math.max(2, Math.floor(blurHeight / 2 ** index));
          runBlurPass(inputTexture, framebuffer, width, height, offset, blurProgram);
          currentTexture = outputTexture;
        }

        for (const [index, offset] of UPSCALE_BLUR_OFFSETS.entries()) {
          const framebuffer = upFramebuffers[index];
          const outputTexture = upTextures[index];
          if (!framebuffer || !outputTexture) continue;

          const width = Math.max(2, Math.floor(blurWidth / 2 ** (3 - index)));
          const height = Math.max(2, Math.floor(blurHeight / 2 ** (3 - index)));
          runBlurPass(currentTexture, framebuffer, width, height, offset, upscaleBlurProgram);
          currentTexture = outputTexture;
        }
      }

      if (
        horizontalBlurRadius > 0 &&
        horizontalFramebuffer &&
        horizontalTexture
      ) {
        const radius = horizontalBlurRadius * runtime.dynBlurScale * 1.3;
        runHorizontalBlurPass(
          currentTexture,
          horizontalFramebuffer,
          radius,
          blurWidth,
          blurHeight,
        );
        currentTexture = horizontalTexture;
      }

      runCompositePass(currentTexture, 0.001 * now, staticFrame);
      markReady();

      const frameDuration = performance.now() - now;
      if (!staticFrame) {
        if (frameDuration > 36.67) {
          const previousScale = runtime.dynBlurScale;
          runtime.dynBlurScale = Math.max(0.25, runtime.dynBlurScale - 1.5 * 0.05);
          if (runtime.dynBlurScale !== previousScale) resize();
        } else if (frameDuration < 25) {
          const previousScale = runtime.dynBlurScale;
          runtime.dynBlurScale = Math.min(0.45, runtime.dynBlurScale + 0.5 * 0.05);
          if (runtime.dynBlurScale !== previousScale) resize();
        }
      }

      if (!staticFrame && (parallaxActive || noiseAmount > 0)) {
        animationFrame = requestAnimationFrame(renderFrame);
      } else {
        running = false;
      }
    };

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
    };

    const handleContextRestored = () => {
      contextLost = false;
      if (!initPrograms()) {
        setWebglSupported(false);
        return;
      }

      layoutLocked = false;
      resize({ force: true });
      running = true;
      animationFrame = requestAnimationFrame(renderFrame);
    };

    const handleResize = () => {
      resize();
      if (staticFrame && !running) {
        running = true;
        animationFrame = requestAnimationFrame(renderFrame);
      }
    };

    if (!initPrograms()) {
      setWebglSupported(false);
      return;
    }

    displayCanvas.addEventListener("webglcontextlost", handleContextLost);
    displayCanvas.addEventListener("webglcontextrestored", handleContextRestored);
    if (!lockSizeAfterInitialLayout) window.addEventListener("resize", handleResize);

    resize();
    running = true;
    animationFrame = requestAnimationFrame(renderFrame);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          runtimeRef.current.isVisible = entry.isIntersecting;
          if (entry.isIntersecting && !running) {
            running = true;
            animationFrame = requestAnimationFrame(renderFrame);
          }
        });
      },
      { rootMargin: "50px", threshold: 0 },
    );
    observer.observe(displayCanvas);

    return () => {
      running = false;
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      if (!lockSizeAfterInitialLayout) window.removeEventListener("resize", handleResize);
      displayCanvas.removeEventListener("webglcontextlost", handleContextLost);
      displayCanvas.removeEventListener("webglcontextrestored", handleContextRestored);
      deleteAllResources();
    };
  }, [colors]);

  if (!webglSupported) {
    return (
      <div
        aria-hidden
        className="hero-gradient-fallback pointer-events-none absolute inset-0 size-full"
        style={{ background: `linear-gradient(180deg, ${COLOR_A} 0%, ${COLOR_B} 100%)` }}
      />
    );
  }

  return (
    <>
      <div
        aria-hidden
        className={`hero-gradient-loading pointer-events-none absolute inset-0 size-full bg-white transition-opacity duration-700 ${isReady ? "opacity-0" : "opacity-100"}`}
      />
      <canvas
        ref={displayCanvasRef}
        aria-hidden
        className={`hero-gradient-canvas pointer-events-none absolute inset-0 size-full object-cover transition-opacity duration-700 ${isReady ? "opacity-100" : "opacity-0"} ${className ?? ""}`}
      />
      <canvas ref={sourceCanvasRef} aria-hidden className="hidden" />
    </>
  );
}
