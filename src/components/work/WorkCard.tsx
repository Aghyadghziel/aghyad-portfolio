import Link from "next/link";
import Image from "next/image";
import { Icon } from "@once-ui-system/core";
import styles from "./WorkCard.module.scss";

export interface WorkCardProps {
  href: string;
  title: string;
  summary: string;
  brand?: string;
  kind?: string;
  role?: string;
  year?: string;
  /** Technologies shown on the card. */
  stack?: string[];
  image?: string;
  /** External link to the live site. */
  link?: string;
  /** Index used for the counter. */
  index: number;
  /** Eager-loads the artwork. Only for a card known to be above the fold. */
  priority?: boolean;
}

/**
 * One project, presented as a card.
 *
 * Every card uses the same layout — no alternating sides — so the list stays
 * scannable. The whole card links to the case study via a stretched link, with
 * the live-site link layered above it. All hover behaviour is pure CSS, which
 * keeps this a server component and ships no JavaScript for the list.
 */
export function WorkCard({
  href,
  title,
  summary,
  brand,
  kind,
  role,
  year,
  stack = [],
  image,
  link,
  index,
  priority = false,
}: WorkCardProps) {
  const isVideo = Boolean(image && /\.(mp4|webm)$/i.test(image));

  return (
    <article className={styles.card}>
      <div className={styles.mediaColumn}>
        <div className={styles.media}>
          {image && !isVideo && (
            <Image
              src={image}
              alt={`${title} — ${kind ?? "project"} interface`}
              fill
              className={styles.image}
              sizes="(max-width: 900px) 100vw, 52vw"
              priority={priority}
              loading={priority ? undefined : "lazy"}
            />
          )}
          {image && isVideo && (
            <video
              className={styles.image}
              src={image}
              muted
              loop
              playsInline
              preload="none"
              aria-label={title}
            />
          )}
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.counter}>{String(index + 1).padStart(2, "0")}</span>
          {kind && <span className={styles.metaItem}>{kind}</span>}
          {year && <span className={styles.metaItem}>{year}</span>}
        </div>

        <h3 className={styles.title}>
          {/* Stretched link: the whole card is clickable, the live link sits above it. */}
          <Link href={href} className={styles.titleLink}>
            {brand ?? title}
          </Link>
        </h3>

        <p className={styles.summary}>{summary}</p>

        {role && (
          <p className={styles.role}>
            <span className={styles.roleLabel}>Role</span>
            {role}
          </p>
        )}

        {stack.length > 0 && (
          <ul className={styles.stack} aria-label={`Technologies used on ${brand ?? title}`}>
            {stack.map((item) => (
              <li className={styles.stackItem} key={item}>
                {item}
              </li>
            ))}
          </ul>
        )}

        <div className={styles.actions}>
          <span className={styles.primaryAction}>
            View project
            <Icon name="arrowLongRight" size="s" className={styles.actionArrow} />
          </span>
          {link && (
            <a href={link} className={styles.liveLink} target="_blank" rel="noopener noreferrer">
              Live site
              <Icon name="arrowUpRightFromSquare" size="xs" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
