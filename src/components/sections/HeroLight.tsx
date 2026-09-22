"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/components/motion/useMotionPreference";
import styles from "./HeroLight.module.scss";

/** Accent light, as RGB triplets, so alpha can be applied per gradient stop. */
const DEEP = "76, 156, 230";
const LIGHT = "143, 197, 255";
const PALE = "214, 236, 255";

/**
 * Full-bleed light behind the hero: a wide horizon glow low in the frame and
 * two soft orbs that drift above it, drawn on a 2D canvas at a quarter of the
 * device resolution and scaled up, so the whole thing costs a few gradients
 * per frame. Follows the pointer gently; pauses when scrolled out of view;
 * draws a single frame for reduced-motion visitors.
 */
export function HeroLight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let active = true;
    let start = performance.now();
    const pointer = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // Quarter resolution is plenty for gradients this soft.
      width = Math.max(1, Math.round(rect.width / 4));
      height = Math.max(1, Math.round(rect.height / 4));
      canvas.width = width;
      canvas.height = height;
    };

    const draw = (now: number) => {
      const t = reduced ? 14 : (now - start) / 1000;
      // Reveal curve: the light fades in over the first 2.4 s.
      const reveal = reduced ? 1 : 1 - (1 - Math.min(Math.max((t - 0.2) / 2.4, 0), 1)) ** 3;

      eased.x += (pointer.x - eased.x) * 0.05;
      eased.y += (pointer.y - eased.y) * 0.05;

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#0e0e0f";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      const cx = width * (0.5 + eased.x * 0.04);
      const horizonY = height * (0.78 + eased.y * 0.02);

      // Horizon: a wide, flat ellipse of light sitting low in the frame.
      ctx.save();
      ctx.translate(cx, horizonY);
      ctx.scale(1.9, 0.42);
      const horizon = ctx.createRadialGradient(0, 0, 0, 0, 0, width * 0.55);
      horizon.addColorStop(0, `rgba(${PALE}, ${0.55 * reveal})`);
      horizon.addColorStop(0.18, `rgba(${LIGHT}, ${0.42 * reveal})`);
      horizon.addColorStop(0.5, `rgba(${DEEP}, ${0.16 * reveal})`);
      horizon.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = horizon;
      ctx.fillRect(-width, -height, width * 2, height * 2);
      ctx.restore();

      // Two orbs drifting slowly on different periods.
      const orbs = [
        {
          x: 0.28 + Math.sin(t * 0.21) * 0.06,
          y: 0.34 + Math.cos(t * 0.17) * 0.05,
          r: 0.34,
          a: 0.22,
        },
        {
          x: 0.74 + Math.cos(t * 0.15) * 0.05,
          y: 0.46 + Math.sin(t * 0.19) * 0.06,
          r: 0.28,
          a: 0.16,
        },
      ];
      for (const orb of orbs) {
        const ox = width * (orb.x + eased.x * 0.03);
        const oy = height * (orb.y + eased.y * 0.03);
        const orbGradient = ctx.createRadialGradient(ox, oy, 0, ox, oy, width * orb.r);
        orbGradient.addColorStop(0, `rgba(${LIGHT}, ${orb.a * reveal})`);
        orbGradient.addColorStop(0.45, `rgba(${DEEP}, ${orb.a * 0.35 * reveal})`);
        orbGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = orbGradient;
        ctx.fillRect(0, 0, width, height);
      }

      if (!reduced && active) frame = requestAnimationFrame(draw);
    };

    const onMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasActive = active;
        active = entry.isIntersecting;
        if (active && !wasActive && !reduced) {
          start = performance.now() - 14000; // resume with the light already up
          frame = requestAnimationFrame(draw);
        }
      },
      { rootMargin: "100px" },
    );

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    observer.observe(canvas);
    if (!reduced) window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame((now) => {
      draw(now);
      setReady(true);
    });

    return () => {
      active = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className={styles.canvas} data-ready={ready || undefined} />;
}
