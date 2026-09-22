"use client";

import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { usePointerMotion } from "@/components/motion/useMotionPreference";
import styles from "./Cursor.module.scss";

type Mode = "none" | "hover" | "text" | "view" | "open" | "drag";

const LABELS: Partial<Record<Mode, string>> = {
  view: "View",
  open: "Open",
  drag: "Drag",
};

/**
 * Custom cursor: a small dot that tracks the pointer exactly and a ring that
 * trails it, growing over links and turning into a labelled disc over
 * elements tagged with `data-cursor`. Mouse only — touch devices and
 * reduced-motion visitors never mount it, and the native cursor stays.
 *
 * The ring is moved with a per-frame lerp written straight to `transform`,
 * so React renders only when the mode changes, never on movement.
 */
export function Cursor() {
  const enabled = usePointerMotion();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("none");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const target = { x: -100, y: -100 };
    const eased = { x: -100, y: -100 };
    let frame = 0;
    let running = true;

    const tick = () => {
      if (!running) return;
      eased.x += (target.x - eased.x) * 0.18;
      eased.y += (target.y - eased.y) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${eased.x}px, ${eased.y}px, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      target.x = event.clientX;
      target.y = event.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      }
      setVisible(true);

      const el = event.target instanceof Element ? event.target : null;
      const tagged = el?.closest<HTMLElement>("[data-cursor]");
      if (el?.closest("input, textarea, select")) setMode("text");
      else if (tagged) setMode((tagged.dataset.cursor as Mode) ?? "hover");
      else if (el?.closest('a, button, [role="button"], label')) setMode("hover");
      else setMode("none");
    };

    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move, { passive: true });
    root.addEventListener("pointerleave", leave);
    frame = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  const label = LABELS[mode];

  return (
    <div aria-hidden="true" className={styles.root}>
      <div
        ref={dot}
        className={classNames(styles.dot, visible && mode !== "text" && !label && styles.on)}
      />
      <div ref={ring} className={styles.ringWrap}>
        <div
          className={classNames(
            styles.ring,
            visible && mode !== "text" && styles.on,
            mode === "hover" && styles.hover,
            label && styles.label,
          )}
        >
          {label && (
            <span key={label} className={styles.labelText}>
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
