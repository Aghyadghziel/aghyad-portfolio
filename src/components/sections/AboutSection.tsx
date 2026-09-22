import Image from "next/image";
import { about, person } from "@/resources";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "./Section";
import styles from "./AboutSection.module.scss";

/**
 * A short introduction, built to be read in about ten seconds.
 *
 * One paragraph of substance plus scannable facts — not a biography, and
 * not a CV dump. The full history lives one click away on the about page.
 */
export function AboutSection() {
  return (
    <Section id="about" eyebrow="About" title="Who I am" divider>
      <div className={styles.layout}>
        <Reveal variant="mask" className={styles.portraitWrap}>
          <div className={styles.portrait}>
            <Image
              src={person.avatar}
              alt={`Portrait of ${person.name}`}
              fill
              className={styles.portraitImage}
              sizes="(max-width: 900px) 40vw, 22vw"
              loading="lazy"
            />
          </div>
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
