"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Smooth, inertial scrolling for the whole page. Anchor links are handled by
 * Lenis itself so `#section` jumps glide instead of snapping. Skipped for
 * reduced-motion visitors and on coarse pointers, where native scrolling
 * already feels right.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    const lenis = new Lenis({
      autoRaf: true,
      anchors: { offset: -80 },
      lerp: 0.09,
      wheelMultiplier: 0.95,
    });
    return () => lenis.destroy();
  }, []);

  return null;
}
