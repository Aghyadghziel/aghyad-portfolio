import { about, baseURL, githubUrl, linkedInUrl, person, specialty } from "@/resources";

/**
 * One Person entity for the whole site.
 *
 * Personal-brand search works by consolidation: Google has to be able to tell
 * that the name on this site, the GitHub account and the LinkedIn profile are
 * the same person, with one job title. Everything here is derived from the
 * content file, so the structured data can never drift from what the page says.
 */
export function PersonSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${baseURL}/#person`,
    name: person.name,
    givenName: person.firstName,
    familyName: person.lastName,
    jobTitle: person.role,
    description: specialty,
    url: baseURL,
    image: `${baseURL}${person.avatar}`,
    email: `mailto:${person.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Riyadh",
      addressCountry: "SA",
    },
    worksFor: {
      "@type": "Organization",
      name: "SIMA Studio",
      url: "https://www.simastudio.it.com",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Kazan Federal University",
    },
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "PostgreSQL",
      "Three.js",
      "WebGL",
      "Web development",
      "Front-end development",
      "Full-stack development",
    ],
    knowsLanguage: person.languages,
    sameAs: [linkedInUrl, githubUrl],
    mainEntityOfPage: `${baseURL}${about.path}`,
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD has no other injection point.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
