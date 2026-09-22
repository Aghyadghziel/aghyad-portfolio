"use client";

import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import styles from "./TextReveal.module.scss";

interface TextRevealProps {
  /** Each string becomes one masked line. */
  lines: string[];
  /** Heading level to render. */
  as?: "h1" | "h2" | "p";
  /** Delay in seconds before the first line starts. */
  delay?: number;
  /** Seconds between consecutive lines. */
  stagger?: number;
  className?: string;
  id?: string;
}

/** Renders `*word*` spans in a line as the italic accent. */
function renderLine(line: string) {
  return line.split(/(\*[^*]+\*)/).map((part, index) =>
    part.startsWith("*") && part.endsWith("*") ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: fragments never reorder.
      <em key={index} className={styles.accent}>
        {part.slice(1, -1)}
      </em>
    ) : (
      part
    ),
  );
}

/**
 * Reveals a headline one line at a time, each sliding up from behind a mask.
 * A word wrapped in asterisks is set in the italic accent.
 *
 * The full text stays in the accessibility tree as a single string via
 * `aria-label`, while the animated lines are hidden from screen readers — so
 * assistive tech reads a normal heading, not a stack of fragments.
 */
export function TextReveal({
  lines,
  as: Tag = "h2",
  delay = 0,
  stagger = 0.09,
  className,
  id,
}: TextRevealProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      id={id}
      ref={ref}
      aria-label={lines.join(" ").replace(/\*/g, "")}
      className={classNames(styles.heading, visible && styles.visible, className)}
    >
      {lines.map((line, index) => (
        <span aria-hidden="true" className={styles.line} key={line}>
          <span className={styles.inner} style={{ transitionDelay: `${delay + index * stagger}s` }}>
            {renderLine(line)}
          </span>
        </span>
      ))}
    </Tag>
  );
}
