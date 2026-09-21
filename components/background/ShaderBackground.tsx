'use client';

import React, { useEffect, useRef } from 'react';

interface ShaderBackgroundProps {
  color?: [number, number, number];
  speedMultiplier?: number;
}

export default function ShaderBackground({
  color = [1.0, 0.38, 0.72],
  speedMultiplier = 1.0,
}: ShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', { alpha: true, antialias: false });
    if (!gl) return;

    const RES_W = 640;
    const RES_H = 360;
    const SPEED = 1.15 * speedMultiplier;
    const ROT_ZOOM = 0.12;
    const DIST_STEP = 0.005;
    const isMobile = typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent);
    const MAX_ITER = isMobile ? 45 : 55;
    const MIN_ITER = 10;

    canvas.width = RES_W;
    canvas.height = RES_H;

    const VERT = `#version 300 es
in vec2 position;
out vec2 vScreen;
void main() {
  vScreen = position;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

    const FRAG = `#version 300 es
precision highp float;
uniform float iTime;
uniform float rotZoom;
uniform float distStep;
uniform vec3  color;
uniform float iterations;
in vec2 vScreen;
out vec4 fragColor;
void main() {
  float t = iTime / 4.;
  vec3 d = -.2 * vec3(vScreen, 1.);
  vec3 c = vec3(0.);
  float dist = 0.;
  for (int i = 0; i < int(iterations); ++i) {
    vec3 p = c;
    dist += distStep;
    p.z -= t + dist;
    p.z *= rotZoom;
    p.xy *= mat2(sin(p.z + vec4(0., 11., 20., 0.)));
    c += length(sin(p.yx * .65) + cos(p.xz * .65 + t)) * d;
  }
  fragColor = vec4(2.5 * color / length(c), 1.);
}`;

    function compile(type: number, src: string): WebGLShader | null {
      if (!gl) return null;
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;

    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uTime = u('iTime');
    const uIter = u('iterations');
    gl.uniform1f(u('rotZoom'), ROT_ZOOM);
    gl.uniform1f(u('distStep'), DIST_STEP);
    gl.uniform3fv(u('color'), color);

    gl.viewport(0, 0, RES_W, RES_H);

    function fit() {
      if (!canvas) return;
      const s = Math.max(window.innerWidth / RES_W, window.innerHeight / RES_H);
      canvas.style.width = `${RES_W * s}px`;
      canvas.style.height = `${RES_H * s}px`;
    }

    window.addEventListener('resize', fit);
    fit();

    let time = Math.random() * 100;
    let iterations = MAX_ITER;
    let last = performance.now();
    let frames = 0;
    let fpsStamp = last;
    let raf = 0;

    function draw() {
      if (!gl) return;
      gl.uniform1f(uTime, time);
      gl.uniform1f(uIter, iterations);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      time += SPEED * dt;
      draw();

      frames++;
      if (now - fpsStamp >= 1000) {
        if (frames < 30 && iterations > MIN_ITER) iterations = Math.max(MIN_ITER, iterations - 5);
        else if (frames > 50 && iterations < MAX_ITER) iterations = Math.min(MAX_ITER, iterations + 5);
        frames = 0;
        fpsStamp = now;
      }
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (raf) return;
      last = performance.now();
      fpsStamp = last;
      frames = 0;
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    function applyMotionPref() {
      if (reduceQuery.matches) {
        stop();
        draw();
      } else if (!document.hidden) {
        start();
      }
    }

    reduceQuery.addEventListener('change', applyMotionPref);

    const onVisibilityChange = () => {
      if (document.hidden) stop();
      else applyMotionPref();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    draw();
    canvas.classList.add('loaded');
    applyMotionPref();

    return () => {
      stop();
      window.removeEventListener('resize', fit);
      reduceQuery.removeEventListener('change', applyMotionPref);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (gl) {
        gl.deleteBuffer(buf);
        gl.deleteProgram(prog);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      }
    };
  }, [color, speedMultiplier]);

  return (
    <div className="bg-wrap" aria-hidden="true">
      <canvas id="bg" ref={canvasRef} draggable={false} />
    </div>
  );
}
