"use client";

import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import styles from "./Reveal.module.scss";

type RevealVariant = "up" | "fade" | "mask";

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Motion style. "mask" wipes the content up from behind a clip edge. */
  variant?: RevealVariant;
  /** Stagger in seconds, applied as a transition-delay. */
  delay?: number;
  /** Fraction of the element that must be visible before revealing. */
  threshold?: number;
  /** Render as a different element, e.g. "li" inside a list. */
  as?: React.ElementType;
}

/**
 * Reveals its children once, the first time they scroll into view.
 *
 * Uses a single IntersectionObserver per instance and disconnects immediately
 * after firing, so nothing stays subscribed to scroll. Animates only `opacity`,
 * `transform` and `clip-path`, all GPU-friendly. When the visitor prefers
 * reduced motion the content is rendered visible on mount and no observer is
 * created at all.
 *
 * The `mask` variant clips its content, and a clipped element reports an
 * intersection ratio of zero — which would deadlock an observer watching the
 * same node. So the clip lives on an inner wrapper while the observed outer
 * element stays unclipped.
 */
export function Reveal({
  children,
  variant = "up",
  delay = 0,
  threshold = 0.15,
  as: Tag = "div",
  className,
  style,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respect the visitor's motion preference: show immediately, observe nothing.
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
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  const isMask = variant === "mask";
  const delayStyle = delay ? `${delay}s` : undefined;

  return (
    <Tag
      ref={ref}
      className={classNames(
        styles.reveal,
        isMask ? styles.maskRoot : styles[variant],
        visible && styles.visible,
        className,
      )}
      style={{ ...style, transitionDelay: isMask ? undefined : delayStyle }}
      {...rest}
    >
      {isMask ? (
        <div className={styles.maskInner} style={{ transitionDelay: delayStyle }}>
          {children}
        </div>
      ) : (
        children
      )}
    </Tag>
  );
}
