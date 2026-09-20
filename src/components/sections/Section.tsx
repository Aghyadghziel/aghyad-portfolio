import classNames from "classnames";
import { Reveal } from "@/components/motion/Reveal";
import styles from "./Section.module.scss";

interface SectionProps {
  /** Anchor id, used by the navigation. */
  id?: string;
  /** Small mono label above the heading. */
  eyebrow?: string;
  /** Section heading. */
  title?: React.ReactNode;
  /** Supporting paragraph, set beside the heading on wide screens. */
  description?: React.ReactNode;
  children: React.ReactNode;
  /** Draws a hairline across the top of the section. */
  divider?: boolean;
  /** Adds clearance for the fixed header when this is the first section. */
  top?: boolean;
  className?: string;
}

/**
 * Shared shell for every section on the site.
 *
 * Owns the container width, the vertical rhythm and the editorial two-column
 * header (heading left, supporting copy right) so sections stay consistent
 * without each one re-implementing the layout.
 */
export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  divider = false,
  top = false,
  className,
}: SectionProps) {
  const hasHeader = Boolean(eyebrow || title || description);

  return (
    <section id={id} className={classNames(
        styles.section,
        divider && styles.divider,
        top && styles.top,
        className,
      )}>
      <div className={styles.container}>
        {hasHeader && (
          <header className={styles.header}>
            {eyebrow && (
              <Reveal variant="fade" className={styles.eyebrow}>
                <span className={styles.eyebrowDot} aria-hidden="true" />
                {eyebrow}
              </Reveal>
            )}
            <div className={styles.headerBody}>
              {title && (
                <Reveal variant="up" delay={0.05}>
                  <h2 className={styles.title}>{title}</h2>
                </Reveal>
              )}
              {description && (
                <Reveal variant="up" delay={0.12}>
                  <p className={styles.description}>{description}</p>
                </Reveal>
              )}
            </div>
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
