import { Icon } from "@once-ui-system/core";
import { githubUrl, home, linkedInUrl } from "@/resources";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { CTA } from "@/components/ui/CTA";
import styles from "./Hero.module.scss";

/**
 * Opening statement.
 *
 * Built so a recruiter can answer "what is he and what does he use" without
 * scrolling: role, one sentence of substance, the five core technologies, and
 * two actions. Nothing else competes for attention here.
 */
export function Hero() {
  const { eyebrow, lines, subline, primary, secondary, stack } = home.hero;

  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.container}>
        <Reveal variant="fade" className={styles.eyebrow}>
          <span className={styles.dot} aria-hidden="true" />
          {eyebrow}
        </Reveal>

        <TextReveal
          id="hero-heading"
          as="h1"
          lines={lines}
          delay={0.1}
          className={styles.headline}
        />

        <Reveal variant="up" delay={0.35}>
          <p className={styles.subline}>{subline}</p>
        </Reveal>

        <Reveal variant="up" delay={0.45} className={styles.actions}>
          <CTA href={primary.href} variant="primary">
            {primary.label}
          </CTA>
          <CTA href={secondary.href} variant="secondary">
            {secondary.label}
          </CTA>
          <div className={styles.socials}>
            <a
              href={githubUrl}
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
            >
              <Icon name="github" size="s" />
            </a>
            <a
              href={linkedInUrl}
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
            >
              <Icon name="linkedin" size="s" />
            </a>
          </div>
        </Reveal>

        <Reveal variant="up" delay={0.55} className={styles.stackRow}>
          <span className={styles.stackLabel}>Core stack</span>
          <ul className={styles.stackList}>
            {stack.map((item) => (
              <li className={styles.stackItem} key={item}>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
