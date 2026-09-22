import { home, person } from "@/resources";
import { Ticker } from "@/components/Ticker";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { CTA } from "@/components/ui/CTA";
import { Portrait } from "./Portrait";
import styles from "./Hero.module.scss";

/**
 * Opening screen.
 *
 * A split page: the statement on the left in the serif, the person on the
 * right, drifting and tilting a little. Below, a ruled strip with a ticker
 * points at the work. No proof card, no light show — type and portrait
 * carry it.
 */
export function Hero() {
  const { eyebrow, lines, subline, primary, secondary, stack, now } = home.hero;
  const ticker = [
    "Full-stack developer",
    ...stack,
    "Founder, SIMA Studio",
    "Open to roles & freelance",
    "Riyadh · GMT+3",
  ];

  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-heading">
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
            <Portrait
              src="/images/portrait.jpg"
              alt={`Portrait of ${person.name}`}
              caption={[person.name, `Riyadh, ${new Date().getFullYear()}`]}
            />
          </Reveal>
        </div>

        <Reveal variant="fade" delay={0.6} className={styles.strip}>
          <span className={styles.stripLead}>Selected work ↓</span>
          <Ticker items={ticker} className={styles.ticker} />
        </Reveal>
      </div>
    </section>
  );
}
