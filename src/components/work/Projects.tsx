import { getPosts } from "@/utils/utils";
import { WorkCard } from "./WorkCard";
import styles from "./Projects.module.scss";

interface ProjectsProps {
  /** 1-based inclusive slice of the sorted list, e.g. [1, 2]. */
  range?: [number, number?];
  /** Slugs to leave out, used on a case study page to hide itself. */
  exclude?: string[];
}

/**
 * The case study list.
 *
 * Projects with an explicit `order` lead the list, then featured work, then
 * the most recent — a portfolio should open with the strongest work, not the
 * oldest. Cards alternate sides. Reading the MDX happens on the server, so no
 * project content ships to the browser as JavaScript.
 */
export function Projects({ range, exclude }: ProjectsProps) {
  let allProjects = getPosts(["src", "app", "work", "projects"]);

  if (exclude && exclude.length > 0) {
    allProjects = allProjects.filter((post) => !exclude.includes(post.slug));
  }

  const sortedProjects = allProjects.sort((a, b) => {
    // An explicit `order` wins: those projects lead the list, lowest first.
    const orderA = a.metadata.order;
    const orderB = b.metadata.order;
    if (orderA !== undefined || orderB !== undefined) {
      if (orderA === undefined) return 1;
      if (orderB === undefined) return -1;
      if (orderA !== orderB) return orderA - orderB;
    }
    // Then featured work, then the most recent.
    if (a.metadata.featured !== b.metadata.featured) {
      return a.metadata.featured ? -1 : 1;
    }
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });

  const displayedProjects = range
    ? sortedProjects.slice(range[0] - 1, range[1] ?? sortedProjects.length)
    : sortedProjects;

  return (
    <div className={styles.list}>
      {displayedProjects.map((post, index) => (
        <WorkCard
          key={post.slug}
          index={index}
          flip={index % 2 === 1}
          href={`/work/${post.slug}`}
          title={post.metadata.title}
          summary={post.metadata.summary}
          brand={post.metadata.brand}
          kind={post.metadata.kind}
          label={post.metadata.label}
          role={post.metadata.role}
          year={post.metadata.year}
          services={post.metadata.services}
          stack={post.metadata.stack}
          image={post.metadata.images?.[0]}
          mobile={post.metadata.mobile}
          link={post.metadata.link}
          priority={index === 0}
        />
      ))}
    </div>
  );
}
