import {
  about,
  baseURL,
  cvPath,
  githubUrl,
  home,
  linkedInUrl,
  person,
  specialty,
  whatsappDisplay,
} from "@/resources";
import { pageMetadata } from "@/utils/metadata";
import { getPosts } from "@/utils/utils";
import styles from "./page.module.scss";

export async function generateMetadata() {
  return pageMetadata({
    title: `CV — ${person.name}, ${person.role}`,
    description: `The curriculum vitae of ${person.name}, full-stack developer in Riyadh: experience, projects, stack and education.`,
    baseURL: baseURL,
    image: home.image,
    path: "/cv",
  });
}

/**
 * The CV, rendered from the same content as the rest of the site so the two
 * can never disagree. `public/Aghyad-Ghziel-CV.pdf` is printed from this page
 * (see `tools/print-cv.sh`), which is why the print styles matter as much as
 * the screen ones.
 */
export default function CV() {
  const projects = getPosts(["src", "app", "work", "projects"])
    .filter((post) => post.metadata.featured)
    .sort((a, b) => (a.metadata.order ?? 99) - (b.metadata.order ?? 99))
    .slice(0, 4);

  const contactItems = [
    { label: "Email", value: person.email, href: `mailto:${person.email}` },
    { label: "Phone", value: whatsappDisplay, href: `tel:${whatsappDisplay.replace(/\s/g, "")}` },
    { label: "Site", value: "aghyad.site", href: baseURL },
    { label: "LinkedIn", value: "in/aghyadghziel", href: linkedInUrl },
    { label: "GitHub", value: "Aghyadghziel", href: githubUrl },
    { label: "Location", value: "Riyadh, Saudi Arabia" },
  ];

  return (
    <main className={styles.page}>
      <div className={styles.sheet}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.name}>{person.name}</h1>
            <p className={styles.role}>{person.role}</p>
            <p className={styles.specialty}>{specialty}</p>
          </div>
          <ul className={styles.contact}>
            {contactItems.map((item) => (
              <li key={item.label}>
                <span className={styles.contactLabel}>{item.label}</span>
                {item.href ? (
                  <a href={item.href} className={styles.contactValue}>
                    {item.value}
                  </a>
                ) : (
                  <span className={styles.contactValue}>{item.value}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <section className={styles.block}>
          <h2 className={styles.blockTitle}>Profile</h2>
          <p className={styles.lead}>{about.intro.text}</p>
        </section>

        <section className={styles.block}>
          <h2 className={styles.blockTitle}>Experience</h2>
          {about.work.experiences.map((role) => (
            <article key={role.company} className={styles.role_}>
              <div className={styles.roleHead}>
                <h3 className={styles.company}>{role.company}</h3>
                <span className={styles.timeframe}>{role.timeframe}</span>
              </div>
              <p className={styles.roleTitle}>{role.role}</p>
              <ul className={styles.bullets}>
                {/* Four lines per role keeps the CV to two pages and reads better
                    than a wall of bullets; the site shows every one. */}
                {role.achievements.slice(0, 4).map((achievement, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: achievements are static JSX.
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
              {role.technologies && <p className={styles.tech}>{role.technologies.join(" · ")}</p>}
            </article>
          ))}
        </section>

        <section className={styles.block}>
          <h2 className={styles.blockTitle}>Selected projects</h2>
          <ul className={styles.projects}>
            {projects.map((project) => (
              <li key={project.slug}>
                <p className={styles.projectHead}>
                  <span className={styles.projectName}>{project.metadata.title}</span>
                  <span className={styles.projectKind}>{project.metadata.kind}</span>
                  {project.metadata.link && (
                    <a className={styles.projectLink} href={project.metadata.link}>
                      {project.metadata.link.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                    </a>
                  )}
                </p>
                <p className={styles.projectSummary}>{project.metadata.summary}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className={styles.columns}>
          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Technical skills</h2>
            <ul className={styles.skills}>
              {about.technical.skills.map((skill) => (
                <li key={skill.title}>
                  <span className={styles.skillTitle}>{skill.title}</span>
                  <span className={styles.skillTags}>
                    {(skill.tags ?? []).map((tag) => tag.name).join(" · ")}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Education</h2>
            <ul className={styles.skills}>
              {about.studies.institutions.map((institution) => (
                <li key={institution.name}>
                  <span className={styles.skillTitle}>{institution.name}</span>
                  <span className={styles.skillTags}>{institution.description}</span>
                </li>
              ))}
            </ul>
            <h2 className={`${styles.blockTitle} ${styles.blockTitleSpaced}`}>Languages</h2>
            <p className={styles.skillTags}>{(person.languages ?? []).join(" · ")}</p>
          </section>
        </div>

        <p className={styles.download}>
          <a href={cvPath} download>
            Download this CV as PDF
          </a>
        </p>
      </div>
    </main>
  );
}
