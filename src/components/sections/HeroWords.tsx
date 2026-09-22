"use client";

import { useEffect, useState } from "react";
import classNames from "classnames";
import styles from "./HeroWords.module.scss";

interface HeroWordsProps {
  /** Each string is one line; the second line is set in a quieter tone. */
  lines: string[];
  className?: string;
  id?: string;
}

/**
 * Headline words rise out of a soft blur one after another on load. The full
 * text stays in the accessibility tree as one string via `aria-label`; the
 * animated fragments are hidden from assistive tech.
 */
export function HeroWords({ lines, className, id }: HeroWordsProps) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  let index = 0;

  return (
    <h1
      id={id}
      aria-label={lines.join(" ")}
      className={classNames(styles.heading, shown && styles.shown, className)}
    >
      {lines.map((line, lineIndex) => (
        <span
          key={line}
          aria-hidden="true"
          className={classNames(styles.line, lineIndex === 1 && styles.quiet)}
        >
          {line.split(" ").map((word, wordIndex, words) => {
            const delay = 0.1 + lineIndex * 0.1 + index++ * 0.03;
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: words repeat within a line and never reorder.
              <span key={`${word}-${wordIndex}`}>
                <span className={styles.mask}>
                  <span className={styles.word} style={{ transitionDelay: `${delay}s` }}>
                    {word}
                  </span>
                </span>
                {wordIndex < words.length - 1 && " "}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
