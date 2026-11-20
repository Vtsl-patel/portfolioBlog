"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  /** Depth 0.1 (far) .. 1 (near): drives size, brightness, parallax, drift. */
  z: number;
  r: number;
  phase: number;
  speed: number;
}

interface Shooter {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

const CURSOR_RADIUS = 150; // stars inside this radius light up and connect
const PAIR_DISTANCE = 95; // max distance for a star-to-star constellation line
const PARALLAX_PX = 24;

/**
 * Fixed full-viewport night sky: twinkle, drift, parallax, cursor constellations and
 * (dark theme) shooting stars. Colours follow `--star`. Pauses when the tab is hidden;
 * one static frame under prefers-reduced-motion. Decorative only.
 */
export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let shooter: Shooter | null = null;
    let raf = 0;
    let last = 0;
    let nextShooter = 3000;
    let color = "#ffffff";
    let baseAlpha = 1;
    let isDark = true;

    const pointer = { x: 0, y: 0, active: false };
    const parallax = { x: 0, y: 0, tx: 0, ty: 0 };

    const readTheme = () => {
      const root = document.documentElement;
      color = getComputedStyle(root).getPropertyValue("--star").trim() || "#ffffff";
      isDark = root.classList.contains("dark");
      baseAlpha = isDark ? 1 : 0.7;
    };

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Ignore small height changes (mobile URL bar).
      if (stars.length && w === width && Math.abs(h - height) < 120) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = w;
      height = h;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(Math.min(220, Math.max(70, (w * h) / 9500)));
      stars = Array.from({ length: count }, () => {
        const z = Math.random() ** 1.6 * 0.9 + 0.1;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: 0.4 + z * 1.3,
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 1.5
        };
      });
    };

    const draw = (t: number, animate: boolean, dt: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;
      ctx.strokeStyle = color;

      parallax.x += (parallax.tx - parallax.x) * 0.05;
      parallax.y += (parallax.ty - parallax.y) * 0.05;
      const scroll = window.scrollY;
      const near: { x: number; y: number; k: number }[] = [];

      for (const s of stars) {
        if (animate) s.y -= dt * 0.003 * s.z; // gentle upward drift

        const px = s.x + parallax.x * s.z * PARALLAX_PX;
        let py = s.y - scroll * s.z * 0.2 + parallax.y * s.z * PARALLAX_PX;
        py = ((py % height) + height) % height;

        const twinkle = animate ? 0.6 + 0.4 * Math.sin(t * 0.001 * s.speed + s.phase) : 0.8;
        let alpha = (0.25 + 0.6 * s.z) * twinkle * baseAlpha;
        let r = s.r;

        if (pointer.active) {
          const d = Math.hypot(px - pointer.x, py - pointer.y);
          if (d < CURSOR_RADIUS) {
            const k = 1 - d / CURSOR_RADIUS;
            alpha = Math.min(1, alpha + k * 0.6);
            r += k * 1.2;
            near.push({ x: px, y: py, k });
          }
        }

        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Constellation lines: cursor -> stars, and star -> star among the nearby ones.
      if (near.length) {
        ctx.lineWidth = 0.6;
        for (const a of near) {
          ctx.globalAlpha = a.k * 0.5 * baseAlpha;
          ctx.beginPath();
          ctx.moveTo(pointer.x, pointer.y);
          ctx.lineTo(a.x, a.y);
          ctx.stroke();
        }
        for (let i = 0; i < near.length; i++) {
          for (let j = i + 1; j < near.length; j++) {
            const d = Math.hypot(near[i].x - near[j].x, near[i].y - near[j].y);
            if (d < PAIR_DISTANCE) {
              ctx.globalAlpha = (1 - d / PAIR_DISTANCE) * 0.35 * baseAlpha;
              ctx.beginPath();
              ctx.moveTo(near[i].x, near[i].y);
              ctx.lineTo(near[j].x, near[j].y);
              ctx.stroke();
            }
          }
        }
      }

      // Shooting star (dark theme only).
      if (animate && isDark) {
        if (!shooter && t > nextShooter) {
          shooter = {
            x: width * (0.25 + Math.random() * 0.75),
            y: height * Math.random() * 0.4,
            vx: -(0.7 + Math.random() * 0.4),
            vy: 0.35 + Math.random() * 0.25,
            life: 1
          };
          nextShooter = t + 7000 + Math.random() * 9000;
        }
        if (shooter) {
          shooter.x += shooter.vx * dt;
          shooter.y += shooter.vy * dt;
          shooter.life -= dt / 900;
          if (shooter.life <= 0) {
            shooter = null;
          } else {
            ctx.lineWidth = 1.3;
            for (let i = 0; i < 8; i++) {
              ctx.globalAlpha = shooter.life * (1 - i / 8) * 0.9;
              ctx.beginPath();
              ctx.moveTo(shooter.x - shooter.vx * i * 9, shooter.y - shooter.vy * i * 9);
              ctx.lineTo(shooter.x - shooter.vx * (i + 1) * 9, shooter.y - shooter.vy * (i + 1) * 9);
              ctx.stroke();
            }
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const frame = (t: number) => {
      const dt = last ? Math.min(50, t - last) : 16;
      last = t;
      draw(t, true, dt);
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (raf || motion.matches || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const renderStatic = () => draw(0, false, 0);

    const onPointerMove = (e: PointerEvent) => {
      if (motion.matches) return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
      parallax.tx = (e.clientX / width - 0.5) * 2;
      parallax.ty = (e.clientY / height - 0.5) * 2;
    };
    const onPointerEnd = () => {
      pointer.active = false;
    };
    const onResize = () => {
      resize();
      if (motion.matches) renderStatic();
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onMotionChange = () => {
      stop();
      pointer.active = false;
      if (motion.matches) renderStatic();
      else start();
    };

    readTheme();
    resize();
    if (motion.matches) renderStatic();
    else start();

    const themeObserver = new MutationObserver(() => {
      readTheme();
      if (motion.matches) renderStatic();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerEnd, { passive: true });
    window.addEventListener("pointercancel", onPointerEnd, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerEnd);
    document.addEventListener("visibilitychange", onVisibility);
    motion.addEventListener("change", onMotionChange);

    return () => {
      stop();
      themeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerEnd);
      window.removeEventListener("pointercancel", onPointerEnd);
      document.documentElement.removeEventListener("pointerleave", onPointerEnd);
      document.removeEventListener("visibilitychange", onVisibility);
      motion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <>
      <div aria-hidden="true" className="sky-glow" />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      />
    </>
  );
}
