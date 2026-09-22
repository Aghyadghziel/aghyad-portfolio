"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import classNames from "classnames";
import { Icon } from "@once-ui-system/core";
import { usePointerMotion } from "@/components/motion/useMotionPreference";
import { Reveal } from "@/components/motion/Reveal";
import styles from "./ProjectIndex.module.scss";

export interface ProjectRow {
  slug: string;
  href: string;
  name: string;
  kind?: string;
  label?: string;
  year?: string;
  summary: string;
  image?: string;
  link?: string;
}

/**
 * The work as an index: one ruled row per project. On a mouse, hovering a
 * row floats its screenshot beside the cursor and lets the other rows fade;
 * on touch the screenshot simply sits above each row. The preview follows
 * the pointer with a per-frame lerp written straight to `transform`, so
 * React renders only when the hovered row changes.
 */
export function ProjectIndex({ rows, startAt = 1 }: { rows: ProjectRow[]; startAt?: number }) {
  const pointer = usePointerMotion();
  const [active, setActive] = useState<number | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const activeRef = useRef<number | null>(null);
  activeRef.current = active;

  useEffect(() => {
    if (!pointer) return;
    const target = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    let frame = 0;
    let running = true;
    let primed = false;

    const tick = () => {
      if (!running) return;
      eased.x += (target.x - eased.x) * 0.12;
      eased.y += (target.y - eased.y) * 0.12;
      const node = preview.current;
      if (node) {
        const tilt = Math.max(-6, Math.min(6, (target.x - eased.x) * 0.04));
        node.style.transform = `translate3d(${eased.x}px, ${eased.y}px, 0) rotate(${tilt}deg)`;
      }
      frame = requestAnimationFrame(tick);
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      target.x = event.clientX;
      target.y = event.clientY;
      // Snap to the pointer the first time so the preview never flies in from the corner.
      if (!primed || activeRef.current === null) {
        eased.x = target.x;
        eased.y = target.y;
        primed = true;
      }
    };

    window.addEventListener("pointermove", move, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
    };
  }, [pointer]);

  return (
    <div className={styles.index}>
      <ol
        className={classNames(styles.list, active !== null && styles.hasActive)}
        onPointerLeave={() => setActive(null)}
      >
        {rows.map((row, index) => (
          <Reveal
            as="li"
            variant="up"
            threshold={0.05}
            delay={Math.min(index * 0.04, 0.2)}
            key={row.slug}
            className={classNames(styles.item, active === index && styles.active)}
            onPointerEnter={() => pointer && setActive(index)}
          >
            {!pointer && row.image && (
              <Link href={row.href} className={styles.inlineMedia} aria-hidden="true" tabIndex={-1}>
                <Image src={row.image} alt="" fill sizes="100vw" className={styles.inlineImage} />
              </Link>
            )}
            <Link href={row.href} className={styles.row}>
              <span className={styles.number}>{String(startAt + index).padStart(2, "0")}</span>
              <span className={styles.name}>{row.name}</span>
              <span className={styles.meta}>
                {row.kind && <span className={styles.kind}>{row.kind}</span>}
                {row.label && <span className={styles.label}>{row.label}</span>}
              </span>
              <span className={styles.year}>{row.year}</span>
              <span className={styles.arrow} aria-hidden="true">
                <Icon name="arrowLongRight" size="s" />
              </span>
            </Link>
            <p className={styles.summary}>{row.summary}</p>
          </Reveal>
        ))}
      </ol>

      {pointer && (
        <div
          ref={preview}
          className={classNames(styles.preview, active !== null && styles.previewOn)}
          aria-hidden="true"
        >
          {rows.map((row, index) =>
            row.image ? (
              <span
                key={row.slug}
                className={classNames(
                  styles.previewImage,
                  active === index && styles.previewImageOn,
                )}
              >
                <Image src={row.image} alt="" fill sizes="30vw" className={styles.previewMedia} />
              </span>
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}
