import Image from "next/image";
import { Icon, Meta, Schema } from "@once-ui-system/core";
import { about, baseURL, calendarLink, home, person, social } from "@/resources";
import { Reveal } from "@/components/motion/Reveal";
import { CTA } from "@/components/ui/CTA";
import { ContactSection } from "@/components/sections";
import styles from "./page.module.scss";

export async function generateMetadata() {
  return Meta.generate({
    title: about.title,
    description: about.description,
    baseURL: baseURL,
    image: home.image,
    path: about.path,
  });
}

/**
 * About page.
 *
 * Establishes credibility without turning into a CV: a short human
 * introduction, the two engagements that back it up, and the capabilities —
 * then straight into contact, because that is what the page is for.
 */
export default function About() {
  return (
    <>
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={about.title}
        description={about.description}
        path={about.path}
        image={home.image}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      <section className={styles.intro}>
        <div className={styles.container}>
          <Reveal variant="fade" className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            About
          </Reveal>

          <div className={styles.introGrid}>
            <div className={styles.introBody}>
              <Reveal variant="up">
                <h1 className={styles.name}>{person.name}</h1>
              </Reveal>
              <Reveal variant="up" delay={0.06}>
                <p className={styles.role}>{person.role}</p>
              </Reveal>
              <Reveal variant="up" delay={0.12}>
                <p className={styles.lead}>{about.intro.description}</p>
              </Reveal>

              <Reveal variant="up" delay={0.18} className={styles.actions}>
                <CTA href={`mailto:${person.email}`} variant="primary">
                  Email me
                </CTA>
                <CTA href={calendarLink} variant="secondary" external>
                  Book a call
                </CTA>
              </Reveal>

              <Reveal variant="up" delay={0.24} className={styles.socials}>
                {social
                  .filter((item) => item.essential)
                  .map((item) => (
                    <a
                      key={item.name}
                      href={item.link}
                      className={styles.socialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon name={item.icon} size="s" />
                      {item.name}
                    </a>
                  ))}
              </Reveal>
            </div>

            <Reveal variant="mask" className={styles.portraitWrap}>
              <div className={styles.portrait}>
                <Image
                  src={person.avatar}
                  alt={`Portrait of ${person.name}`}
                  fill
                  className={styles.portraitImage}
                  sizes="(max-width: 900px) 70vw, 32vw"
                  priority
                />
              </div>
              {person.languages && person.languages.length > 0 && (
                <ul className={styles.languages}>
                  {person.languages.map((language) => (
                    <li className={styles.language} key={language}>
                      {language}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {about.work.display && (
        <section className={styles.block} aria-labelledby="experience">
          <div className={styles.container}>
            <h2 id="experience" className={styles.blockTitle}>
              {about.work.title}
            </h2>
            <div className={styles.experiences}>
              {about.work.experiences.map((experience, index) => (
                <Reveal
                  variant="up"
                  delay={Math.min(index * 0.08, 0.2)}
                  className={styles.experience}
                  key={`${experience.company}-${experience.role}`}
                >
                  <div className={styles.experienceMeta}>
                    <p className={styles.timeframe}>{experience.timeframe}</p>
                  </div>
                  <div className={styles.experienceBody}>
                    <h3 className={styles.company}>{experience.company}</h3>
                    <p className={styles.experienceRole}>{experience.role}</p>
                    <ul className={styles.achievements}>
                      {experience.achievements.map((achievement, achievementIndex) => (
                        <li
                          className={styles.achievement}
                          key={`${experience.company}-${achievementIndex}`}
                        >
                          {achievement}
                        </li>
                      ))}
                    </ul>
                    {experience.images && experience.images.length > 0 && (
                      <div className={styles.experienceImages}>
                        {experience.images.map((image) => (
                          <div className={styles.experienceImage} key={image.src}>
                            <Image
                              src={image.src}
                              alt={image.alt}
                              fill
                              className={styles.experienceImageMedia}
                              sizes="(max-width: 900px) 100vw, 45vw"
                              loading="lazy"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {about.technical.display && (
        <section className={styles.block} aria-labelledby="capabilities">
          <div className={styles.container}>
            <h2 id="capabilities" className={styles.blockTitle}>
              {about.technical.title}
            </h2>
            <div className={styles.skills}>
              {about.technical.skills.map((skill, index) => (
                <Reveal
                  variant="up"
                  delay={Math.min(index * 0.08, 0.2)}
                  className={styles.skill}
                  key={skill.title}
                >
                  <h3 className={styles.skillTitle}>{skill.title}</h3>
                  <p className={styles.skillDescription}>{skill.description}</p>
                  {skill.tags && skill.tags.length > 0 && (
                    <ul className={styles.tags}>
                      {skill.tags.map((tag) => (
                        <li className={styles.tag} key={tag.name}>
                          {tag.icon && <Icon name={tag.icon} size="s" className={styles.tagIcon} />}
                          {tag.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {about.studies.display && (
        <section className={styles.block} aria-labelledby="background">
          <div className={styles.container}>
            <h2 id="background" className={styles.blockTitle}>
              {about.studies.title}
            </h2>
            <div className={styles.studies}>
              {about.studies.institutions.map((institution, index) => (
                <Reveal
                  variant="up"
                  delay={Math.min(index * 0.08, 0.16)}
                  className={styles.study}
                  key={institution.name}
                >
                  <h3 className={styles.studyName}>{institution.name}</h3>
                  <p className={styles.studyDescription}>{institution.description}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactSection />
    </>
  );
}
