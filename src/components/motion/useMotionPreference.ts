"use client";

import { useEffect, useState } from "react";

/**
 * Subscribes to a media query and returns whether it currently matches.
 * Returns `false` during SSR and on the first client render so that markup
 * matches, then updates on mount.
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);

    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/**
 * True when the visitor has asked the system to reduce motion.
 * Every animated component in this project must honour it.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * True only for devices with an accurate pointer that can hover — i.e. a mouse.
 * Used to gate magnetic buttons, tilt and the custom cursor so touch devices
 * never pay for interactions they cannot use.
 */
export function useFinePointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

/**
 * Combined gate: run pointer-driven motion only when the device supports it
 * and the visitor has not opted out.
 */
export function usePointerMotion(): boolean {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  return fine && !reduced;
}
