import Image from "next/image";
import { home, person } from "@/resources";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { CTA } from "@/components/ui/CTA";
import styles from "./Hero.module.scss";

/**
 * Opening screen.
 *
 * A split page: the statement on the left in the serif, the person on the
 * right. Below the fold line, a ruled strip points at the work. No proof
 * card, no light show — the type and the portrait carry it.
 */
export function Hero() {
  const { eyebrow, lines, subline, primary, secondary, stack, now } = home.hero;

  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.wash} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.copy}>
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
              <CTA href={primary.href} variant="primary" arrow>
                {primary.label}
              </CTA>
              <CTA href={secondary.href} variant="secondary" arrow>
                {secondary.label}
              </CTA>
            </Reveal>

            {now && (
              <Reveal variant="fade" delay={0.55} className={styles.now}>
                <span className={styles.nowLabel}>Now</span>
                <span className={styles.nowValue}>{now}</span>
              </Reveal>
            )}
          </div>

          <Reveal variant="mask" delay={0.2} className={styles.portraitWrap}>
            <figure className={styles.portrait}>
              <Image
                src="/images/portrait.jpg"
                alt={`Portrait of ${person.name}`}
                fill
                priority
                sizes="(min-width: 1024px) 38vw, (min-width: 640px) 60vw, 100vw"
                className={styles.portraitImage}
              />
              <figcaption className={styles.caption}>
                <span>{person.name}</span>
                <span>Riyadh, {new Date().getFullYear()}</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <Reveal variant="fade" delay={0.6} className={styles.strip}>
          <span className={styles.stripItem}>Selected work ↓</span>
          <span className={styles.stripItem}>{stack.join(" · ")}</span>
        </Reveal>
      </div>
    </section>
  );
}
