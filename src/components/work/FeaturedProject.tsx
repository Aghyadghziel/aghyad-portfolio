import Image from "next/image";
import Link from "next/link";
import { Icon } from "@once-ui-system/core";
import { Reveal } from "@/components/motion/Reveal";
import styles from "./FeaturedProject.module.scss";

export interface FeaturedProjectProps {
  href: string;
  name: string;
  kind?: string;
  label?: string;
  year?: string;
  summary: string;
  image: string;
  number: string;
}

/**
 * The first project as a wide plate above the index: one cinematic crop of
 * the screen, a caption row beneath it in the same ruled language as the
 * rows that follow. The artwork eases in on hover; the whole plate is a link.
 */
export function FeaturedProject({
  href,
  name,
  kind,
  label,
  year,
  summary,
  image,
  number,
}: FeaturedProjectProps) {
  return (
    <Reveal variant="up" threshold={0.05} className={styles.wrap}>
      <Link href={href} className={styles.plate} aria-label={`View project: ${name}`}>
        <span className={styles.media}>
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 90vw, 100vw"
            className={styles.image}
          />
        </span>
        <span className={styles.badge}>
          <span className={styles.badgeNumber}>{number}</span>
          <span className={styles.badgeText}>{label}</span>
        </span>
      </Link>
      <div className={styles.caption}>
        <div className={styles.captionMain}>
          <Link href={href} className={styles.name}>
            {name}
          </Link>
          <p className={styles.summary}>{summary}</p>
        </div>
        <div className={styles.captionMeta}>
          <span>{kind}</span>
          <span>{year}</span>
          <Link href={href} className={styles.open}>
            Open
            <Icon name="arrowLongRight" size="s" />
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
