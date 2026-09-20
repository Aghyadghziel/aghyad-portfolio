import { Projects } from "@/components/work/Projects";
import { Reveal } from "@/components/motion/Reveal";
import { CTA } from "@/components/ui/CTA";
import { Section } from "./Section";
import styles from "./ProjectsSection.module.scss";

/**
 * Selected projects on the home page.
 *
 * Shows the two strongest projects in full rather than a grid of thumbnails,
 * and links to the full list for anyone still reading.
 */
export function ProjectsSection() {
  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title={<>Selected projects</>}
      description={
        <>
          Production applications with real users, payments and deadlines behind them. Each one has
          a write-up covering the problem, what I built and the stack.
        </>
      }
      divider
    >
      <Projects range={[1, 2]} />

      <Reveal variant="up" className={styles.footer}>
        <CTA href="/work" variant="secondary">
          All projects
        </CTA>
      </Reveal>
    </Section>
  );
}
