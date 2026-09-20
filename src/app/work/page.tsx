import { Meta, Schema } from "@once-ui-system/core";
import { about, baseURL, person, work } from "@/resources";
import { Projects } from "@/components/work/Projects";
import { ContactSection, Section } from "@/components/sections";

export async function generateMetadata() {
  return Meta.generate({
    title: work.title,
    description: work.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(work.title)}`,
    path: work.path,
  });
}

export default function Work() {
  return (
    <>
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={work.path}
        title={work.title}
        description={work.description}
        image={`/api/og/generate?title=${encodeURIComponent(work.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Section
        eyebrow="Projects"
        title={<>Projects</>}
        description={
          <>
            Production applications with real users, payments and deadlines behind them. Each entry
            covers the problem, what I built and the stack it runs on.
          </>
        }
        top
      >
        <Projects />
      </Section>
      <ContactSection />
    </>
  );
}
