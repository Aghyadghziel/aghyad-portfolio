"use client";

import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { useReducedMotion } from "@/components/motion/useMotionPreference";
import styles from "./ProofVideo.module.scss";

/**
 * The client site in motion, over its poster. Starts only after the page has
 * finished loading, so it never competes with the first paint, and fades in
 * once the first frame is actually playing. Skipped for reduced motion.
 */
export function ProofVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const start = () => ref.current?.play().catch(() => {});
    if (document.readyState === "complete") {
      const id = window.setTimeout(start, 600);
      return () => window.clearTimeout(id);
    }
    window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, [reduced]);

  if (reduced) return null;

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      tabIndex={-1}
      aria-hidden="true"
      onPlaying={() => setPlaying(true)}
      className={classNames(styles.video, playing && styles.playing)}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
