import classNames from "classnames";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import styles from "./Section.module.scss";

interface SectionProps {
  /** Anchor id, used by the navigation. */
  id?: string;
  /** Small mono label above the heading. */
  eyebrow?: string;
  /** Section heading. A string rises line by line; a node fades up. */
  title?: React.ReactNode;
  /** Supporting paragraph, set beside the heading on wide screens. */
  description?: React.ReactNode;
  /** Small mono note at the far end of the header, e.g. a count. */
  aside?: React.ReactNode;
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
 * Owns the container width, the vertical rhythm and the editorial header
 * (display heading left, supporting copy right) so sections stay consistent
 * without each one re-implementing the layout.
 */
export function Section({
  id,
  eyebrow,
  title,
  description,
  aside,
  children,
  divider = false,
  top = false,
  className,
}: SectionProps) {
  const hasHeader = Boolean(eyebrow || title || description);

  return (
    <section
      id={id}
      className={classNames(
        styles.section,
        divider && styles.divider,
        top && styles.top,
        className,
      )}
    >
      <div className={styles.container}>
        {hasHeader && (
          <header className={styles.header}>
            <div className={styles.headerMain}>
              {eyebrow && (
                <Reveal variant="fade" className={styles.eyebrow}>
                  <span className={styles.eyebrowDot} aria-hidden="true" />
                  {eyebrow}
                </Reveal>
              )}
              {typeof title === "string" ? (
                <TextReveal as="h2" lines={[title]} className={styles.title} />
              ) : (
                title && (
                  <Reveal variant="up" delay={0.05}>
                    <h2 className={classNames("display-lg", styles.title)}>{title}</h2>
                  </Reveal>
                )
              )}
            </div>
            {(description || aside) && (
              <div className={styles.headerSide}>
                {description && (
                  <Reveal variant="up" delay={0.15}>
                    <p className={styles.description}>{description}</p>
                  </Reveal>
                )}
                {aside && (
                  <Reveal variant="fade" delay={0.2} className={styles.aside}>
                    {aside}
                  </Reveal>
                )}
              </div>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
