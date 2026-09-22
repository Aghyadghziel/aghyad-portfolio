import { cvPath, home, person } from "@/resources";
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
 * right, drifting and tilting a little. Two mono rows under the buttons answer
 * the two questions a recruiter has in the first fifteen seconds — what he
 * builds with, and whether he is available. Below, a ruled strip with a ticker
 * points at the work.
 */
export function Hero() {
  const { eyebrow, lines, subline, primary, secondary, stack, now } = home.hero;
  // The ticker carries the positioning; the stack sits still below the buttons,
  // so a recruiter can read the technologies without waiting for them to scroll past.
  const ticker = [
    person.role,
    "React & Next.js",
    "TypeScript",
    "Real-time 3D",
    "Arabic-first interfaces",
    "Riyadh · GMT+3",
    "Open to work",
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
              {/* Recruiters ask for a CV before they ask for anything else. */}
              <CTA href={cvPath} variant="ghost" magnetic={false}>
                Download CV
              </CTA>
            </Reveal>

            <Reveal variant="fade" delay={0.55} className={styles.facts}>
              <p className={styles.fact}>
                <span className={styles.factLabel}>Stack</span>
                <span className={styles.factValue}>{stack.join(" · ")}</span>
              </p>
              {now && (
                <p className={styles.fact}>
                  <span className={styles.factLabel}>Now</span>
                  <span className={styles.factValue}>{now}</span>
                </p>
              )}
            </Reveal>
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
