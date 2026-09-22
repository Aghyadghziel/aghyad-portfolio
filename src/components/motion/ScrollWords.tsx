"use client";

import { useEffect, useRef } from "react";
import classNames from "classnames";
import styles from "./ScrollWords.module.scss";

interface ScrollWordsProps {
  text: string;
  className?: string;
  as?: "p" | "h2";
}

/**
 * A paragraph whose words brighten one after another as it scrolls up the
 * screen, so the reader's eye is led through it at reading pace. Progress is
 * computed from the block's position in the viewport and written as a CSS
 * variable — one style write per frame, no per-word React updates.
 */
export function ScrollWords({ text, className, as: Tag = "p" }: ScrollWordsProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.style.setProperty("--progress", "1");
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight;
      // Starts when the block's top reaches 85% of the viewport, ends at 35%.
      const start = vh * 0.85;
      const end = vh * 0.35;
      const raw = (start - rect.top) / (start - end + rect.height * 0.6);
      node.style.setProperty("--progress", String(Math.min(1, Math.max(0, raw))));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <Tag ref={ref} className={classNames(styles.block, className)} aria-label={text}>
      {words.map((word, index) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: words never reorder.
          key={index}
          aria-hidden="true"
          className={styles.word}
          style={{ "--i": index / words.length } as React.CSSProperties}
        >
          {word}{" "}
        </span>
      ))}
    </Tag>
  );
}
