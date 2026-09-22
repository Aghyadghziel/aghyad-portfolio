import { about, person } from "@/resources";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "./Section";
import styles from "./AboutSection.module.scss";

/**
 * A short introduction, built to be read in about ten seconds.
 *
 * One paragraph of substance in the serif, plus scannable facts — not a
 * biography. The portrait lives in the hero; the full history is on /about.
 */
export function AboutSection() {
  return (
    <Section id="about" eyebrow="01 — About" title="Who I *am*." divider>
      <div className={styles.layout}>
        <Reveal variant="fade" className={styles.aside}>
          <p className={styles.asideLine}>
            Two years on SaaS products, then a studio of my own. The full history is on the{" "}
            <a href="/about" className={styles.asideLink}>
              about page
            </a>
            .
          </p>
        </Reveal>

        <div className={styles.body}>
          <Reveal variant="up">
            <p className={styles.lead}>{about.intro.description}</p>
          </Reveal>

          <Reveal variant="up" delay={0.08}>
            <dl className={styles.facts}>
              <div className={styles.fact}>
                <dt className={styles.factLabel}>Focus</dt>
                <dd className={styles.factValue}>Frontend-leaning full stack</dd>
              </div>
              <div className={styles.fact}>
                <dt className={styles.factLabel}>Education</dt>
                <dd className={styles.factValue}>BSc Computer Science</dd>
              </div>
              <div className={styles.fact}>
                <dt className={styles.factLabel}>Languages</dt>
                <dd className={styles.factValue}>{person.languages?.join(", ")}</dd>
              </div>
              <div className={styles.fact}>
                <dt className={styles.factLabel}>Working style</dt>
                <dd className={styles.factValue}>Remote, distributed teams</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
