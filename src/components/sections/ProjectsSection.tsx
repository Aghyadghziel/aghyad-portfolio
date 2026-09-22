import { Projects } from "@/components/work/Projects";
import { Reveal } from "@/components/motion/Reveal";
import { CTA } from "@/components/ui/CTA";
import { Section } from "./Section";
import styles from "./ProjectsSection.module.scss";

/**
 * Selected projects on the home page.
 *
 * The five strongest projects as an index, with the full list one click away.
 */
export function ProjectsSection() {
  return (
    <Section
      id="projects"
      eyebrow="02 — Selected work"
      title="Work that *shipped*."
      description={
        <>
          SaaS platforms with real users and payments, and studio work where the interface is a
          real-time 3D scene. Hover a row to see it; open it for the full story.
        </>
      }
      divider
    >
      <Projects range={[1, 5]} featured />

      <Reveal variant="up" className={styles.footer}>
        <CTA href="/work" variant="secondary" arrow>
          All projects
        </CTA>
      </Reveal>
    </Section>
  );
}
