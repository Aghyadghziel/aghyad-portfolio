"use client";

import { useCallback, useEffect, useRef } from "react";
import classNames from "classnames";
import { usePointerMotion } from "./useMotionPreference";
import styles from "./Magnetic.module.scss";

interface MagneticProps {
  children: React.ReactNode;
  /** How far the element follows the pointer, as a fraction of the offset. */
  strength?: number;
  /** Maximum travel in pixels, so large targets stay controlled. */
  max?: number;
  className?: string;
}

/**
 * Pulls its child gently toward the pointer while hovered, then springs back.
 *
 * Pointer handling is throttled to one animation frame and writes only a
 * `translate3d`, so it never triggers layout. The effect is skipped entirely on
 * touch devices and when reduced motion is requested — in that case this is a
 * plain wrapper with no listeners attached.
 */
export function Magnetic({ children, strength = 0.28, max = 14, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const frame = useRef<number | null>(null);
  const enabled = usePointerMotion();

  const move = useCallback(
    (event: React.PointerEvent<HTMLSpanElement>) => {
      if (!enabled) return;
      const node = ref.current;
      if (!node) return;

      const { clientX, clientY } = event;

      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        const offsetX = clientX - (rect.left + rect.width / 2);
        const offsetY = clientY - (rect.top + rect.height / 2);
        const x = Math.max(-max, Math.min(max, offsetX * strength));
        const y = Math.max(-max, Math.min(max, offsetY * strength));
        node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    },
    [enabled, max, strength],
  );

  const reset = useCallback(() => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    const node = ref.current;
    if (node) node.style.transform = "";
  }, []);

  useEffect(() => {
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  // Without a fine pointer there is nothing to follow — render a plain wrapper.
  if (!enabled) {
    return <span className={classNames(styles.magnetic, className)}>{children}</span>;
  }

  return (
    <span
      ref={ref}
      className={classNames(styles.magnetic, styles.active, className)}
      onPointerMove={move}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      {children}
    </span>
  );
}
