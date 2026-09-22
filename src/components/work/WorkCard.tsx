import Link from "next/link";
import Image from "next/image";
import classNames from "classnames";
import { Icon } from "@once-ui-system/core";
import { Reveal } from "@/components/motion/Reveal";
import styles from "./WorkCard.module.scss";

export interface WorkCardProps {
  href: string;
  title: string;
  summary: string;
  brand?: string;
  kind?: string;
  /** Engagement type, e.g. "Client project" or "Self-initiated concept". */
  label?: string;
  role?: string;
  year?: string;
  services?: string[];
  /** Technologies shown on the card. */
  stack?: string[];
  image?: string;
  /** Phone screenshot tucked into the corner of the artwork. */
  mobile?: string;
  /** External link to the live site. */
  link?: string;
  /** Index used for the counter. */
  index: number;
  /** Mirrors image and text on wide screens. */
  flip?: boolean;
  /** Eager-loads the artwork. Only for a card known to be above the fold. */
  priority?: boolean;
}

/**
 * One project as an editorial feature: a wide screen with the phone view
 * tucked into its corner, and beside it the number, the name in display
 * type, what it was and what it was built with. Hover is pure CSS — the
 * artwork eases in, the number rolls to the accent — so this stays a server
 * component and ships no JavaScript for the list.
 */
export function WorkCard({
  href,
  title,
  summary,
  brand,
  kind,
  label,
  role,
  year,
  services = [],
  stack = [],
  image,
  mobile,
  link,
  index,
  flip = false,
  priority = false,
}: WorkCardProps) {
  const isVideo = Boolean(image && /\.(mp4|webm)$/i.test(image));
  const number = String(index + 1).padStart(2, "0");
  const name = brand ?? title;

  return (
    <Reveal
      variant="up"
      threshold={0.08}
      as="article"
      className={classNames(styles.card, flip && styles.flip)}
    >
      <Link
        href={href}
        data-cursor="view"
        aria-label={`View project: ${name}`}
        className={styles.media}
      >
        <span className={styles.screen}>
          {image && !isVideo && (
            <Image
              src={image}
              alt={`${name} — ${kind ?? "project"} interface`}
              fill
              className={styles.image}
              sizes="(min-width: 1024px) 64vw, 100vw"
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
              aria-label={name}
            />
          )}
        </span>
        <span className={styles.ring} aria-hidden="true" />
        {mobile && (
          <span className={styles.phone} aria-hidden="true">
            <span className={styles.phoneScreen}>
              <Image src={mobile} alt="" fill sizes="12vw" className={styles.image} />
            </span>
          </span>
        )}
      </Link>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.number}>
            <span className={styles.numberText}>{number}</span>
            <span className={styles.numberGhost} aria-hidden="true">
              {number}
            </span>
          </span>
          <span className={styles.kind}>
            {kind}
            {year && ` · ${year}`}
          </span>
        </div>

        <h3 className={classNames("display-md", styles.title)}>
          <Link href={href} className={styles.titleLink}>
            {name}
          </Link>
        </h3>

        {label && <p className={styles.label}>{label}</p>}

        <p className={styles.summary}>{summary}</p>

        {stack.length > 0 && (
          <ul className={styles.tags} aria-label={`Technologies used on ${name}`}>
            {stack.slice(0, 5).map((item) => (
              <li className={styles.tag} key={item}>
                {item}
              </li>
            ))}
          </ul>
        )}

        {(services.length > 0 || role) && (
          <dl className={styles.facts}>
            {services.length > 0 && (
              <div>
                <dt className={styles.factLabel}>Scope</dt>
                <dd className={styles.factValue}>
                  {services.slice(0, 3).map((service) => (
                    <span key={service} className={styles.factLine}>
                      {service}
                    </span>
                  ))}
                </dd>
              </div>
            )}
            {role && (
              <div>
                <dt className={styles.factLabel}>Role</dt>
                <dd className={styles.factValue}>
                  {role.split(" · ").map((part) => (
                    <span key={part} className={styles.factLine}>
                      {part}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        )}

        <div className={styles.actions}>
          <Link href={href} className={styles.view}>
            View project
            <Icon name="arrowUpRight" size="s" className={styles.arrow} />
          </Link>
          {link && (
            <a
              href={link}
              className={styles.live}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="open"
            >
              Live site
              <Icon name="arrowUpRightFromSquare" size="xs" />
            </a>
          )}
        </div>
      </div>
    </Reveal>
  );
}
