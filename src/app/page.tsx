import { Schema } from "@once-ui-system/core";
import { about, baseURL, home, person } from "@/resources";
import { ScrollToHash } from "@/components";
import {
  AboutSection,
  ContactSection,
  ExperienceSection,
  Hero,
  ProjectsSection,
  StackSection,
} from "@/components/sections";
import { pageMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  return pageMetadata({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

/**
 * Home page.
 *
 * Ordered the way a recruiter reads: what he is → who he is → where he has
 * worked → what he has built → what he uses → how to reach him.
 */
export default function Home() {
  return (
    <>
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={home.image}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      {/* Handles deep links like /#projects arriving from another page. */}
      <ScrollToHash />

      <Hero />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <StackSection />
      <ContactSection />
    </>
  );
}
