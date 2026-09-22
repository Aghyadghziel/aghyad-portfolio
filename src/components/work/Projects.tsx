import { getPosts } from "@/utils/utils";
import { FeaturedProject } from "./FeaturedProject";
import { ProjectIndex } from "./ProjectIndex";

interface ProjectsProps {
  /** 1-based inclusive slice of the sorted list, e.g. [1, 2]. */
  range?: [number, number?];
  /** Slugs to leave out, used on a case study page to hide itself. */
  exclude?: string[];
  /** Shows the first project as a wide plate above the index. */
  featured?: boolean;
}

/**
 * The case study list.
 *
 * Projects with an explicit `order` lead the list, then featured work, then
 * the most recent — a portfolio should open with the strongest work, not the
 * oldest. Reading the MDX happens on the server; only the row data reaches
 * the client index.
 */
export function Projects({ range, exclude, featured = false }: ProjectsProps) {
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

  const rows = displayedProjects.map((post) => ({
    slug: post.slug,
    href: `/work/${post.slug}`,
    name: post.metadata.brand || post.metadata.title,
    kind: post.metadata.kind,
    label: post.metadata.label,
    year: post.metadata.year,
    summary: post.metadata.summary,
    image: post.metadata.images?.find((src) => !/\.(mp4|webm)$/i.test(src)),
    link: post.metadata.link,
  }));

  const start = range ? range[0] : 1;
  const [first, ...rest] = rows;

  if (featured && first?.image) {
    return (
      <>
        <FeaturedProject
          href={first.href}
          name={first.name}
          kind={first.kind}
          label={first.label}
          year={first.year}
          summary={first.summary}
          image={first.image}
          number={String(start).padStart(2, "0")}
        />
        <ProjectIndex rows={rest} startAt={start + 1} />
      </>
    );
  }

  return <ProjectIndex rows={rows} startAt={start} />;
}
