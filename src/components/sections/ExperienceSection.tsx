import { about } from "@/resources";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "./Section";
import styles from "./ExperienceSection.module.scss";

/**
 * Work history.
 *
 * Laid out so the three things a recruiter checks first — company, role and
 * dates — sit on one line, with the detail as short bullets underneath and the
 * technologies for that engagement listed separately. No paragraphs.
 */
export function ExperienceSection() {
  if (!about.work.display) return null;

  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title={<>Where I&rsquo;ve worked</>}
      divider
    >
      <ol className={styles.list}>
        {about.work.experiences.map((experience, index) => (
          <Reveal
            as="li"
            variant="up"
            delay={Math.min(index * 0.06, 0.18)}
            className={styles.item}
            key={`${experience.company}-${experience.role}`}
          >
            <div className={styles.head}>
              <h3 className={styles.company}>{experience.company}</h3>
              <span className={styles.timeframe}>{experience.timeframe}</span>
            </div>
            <p className={styles.role}>{experience.role}</p>

            <ul className={styles.points}>
              {experience.achievements.map((achievement, achievementIndex) => (
                <li className={styles.point} key={`${experience.company}-${achievementIndex}`}>
                  {achievement}
                </li>
              ))}
            </ul>

            {experience.technologies && experience.technologies.length > 0 && (
              <ul className={styles.tech} aria-label={`Technologies used at ${experience.company}`}>
                {experience.technologies.map((tech) => (
                  <li className={styles.techItem} key={tech}>
                    {tech}
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
