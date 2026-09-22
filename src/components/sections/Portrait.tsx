"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { usePointerMotion } from "@/components/motion/useMotionPreference";
import styles from "./Portrait.module.scss";

interface PortraitProps {
  src: string;
  alt: string;
  caption: [string, string];
}

/**
 * The hero portrait. It drifts up slightly slower than the page as you
 * scroll (parallax) and tilts a few degrees toward the pointer on a mouse.
 * Both are written straight to `transform` on animation frames.
 */
export function Portrait({ src, alt, caption }: PortraitProps) {
  const frame = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const pointer = usePointerMotion();

  useEffect(() => {
    const node = frame.current;
    const inner = media.current;
    if (!node || !inner) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tilt = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    let raf = 0;
    let running = true;

    const tick = () => {
      if (!running) return;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight;
      // Parallax: the image slides up to 6% of its height across the viewport.
      const t = (rect.top + rect.height / 2 - vh / 2) / vh;
      const shift = t * 6;
      eased.x += (tilt.x - eased.x) * 0.08;
      eased.y += (tilt.y - eased.y) * 0.08;
      inner.style.transform = `translate3d(0, ${shift}%, 0) scale(1.08)`;
      node.style.transform = `perspective(1200px) rotateX(${-eased.y}deg) rotateY(${eased.x}deg)`;
      raf = requestAnimationFrame(tick);
    };

    const move = (event: PointerEvent) => {
      if (!pointer || event.pointerType !== "mouse") return;
      const rect = node.getBoundingClientRect();
      const inside =
        event.clientX > rect.left - 120 &&
        event.clientX < rect.right + 120 &&
        event.clientY > rect.top - 120 &&
        event.clientY < rect.bottom + 120;
      if (!inside) {
        tilt.x = 0;
        tilt.y = 0;
        return;
      }
      tilt.x = ((event.clientX - (rect.left + rect.width / 2)) / rect.width) * 5;
      tilt.y = ((event.clientY - (rect.top + rect.height / 2)) / rect.height) * 5;
    };

    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
    };
  }, [pointer]);

  return (
    <div ref={frame} className={styles.frame}>
      <figure className={styles.portrait}>
        <div ref={media} className={styles.media}>
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="(min-width: 1024px) 38vw, (min-width: 640px) 60vw, 100vw"
            className={styles.image}
          />
        </div>
        <figcaption className={styles.caption}>
          <span>{caption[0]}</span>
          <span>{caption[1]}</span>
        </figcaption>
      </figure>
    </div>
  );
}
