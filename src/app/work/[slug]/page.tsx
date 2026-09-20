import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Icon, Meta, Schema } from "@once-ui-system/core";
import { getPosts } from "@/utils/utils";
import { about, baseURL, person, work } from "@/resources";
import { CustomMDX, ScrollToHash } from "@/components";
import { Projects } from "@/components/work/Projects";
import { ContactSection } from "@/components/sections";
import { Reveal } from "@/components/motion/Reveal";
import { CTA } from "@/components/ui/CTA";
import styles from "./page.module.scss";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = getPosts(["src", "app", "work", "projects"]);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<Metadata> {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  const posts = getPosts(["src", "app", "work", "projects"]);
  const post = posts.find((item) => item.slug === slugPath);

  if (!post) return {};

  return Meta.generate({
    title: `${post.metadata.title} — Case study`,
    description: post.metadata.summary,
    baseURL: baseURL,
    image: post.metadata.images?.[0] || post.metadata.image,
    path: `${work.path}/${post.slug}`,
  });
}

/**
 * A single case study.
 *
 * Laid out as an article with a sticky fact panel: the narrative carries the
 * story, while role, services, stack and the live link stay visible for a
 * reader who is skimming to decide whether this person can do their job.
 */
export default async function Project({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}) {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  const post = getPosts(["src", "app", "work", "projects"]).find(
    (item) => item.slug === slugPath,
  );

  if (!post) {
    notFound();
  }

  const { metadata } = post;
  const [cover, ...supporting] = metadata.images ?? [];
  const isVideo = (src: string) => /\.(mp4|webm)$/i.test(src);

  return (
    <>
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        path={`${work.path}/${post.slug}`}
        title={metadata.title}
        description={metadata.summary}
        datePublished={metadata.publishedAt}
        dateModified={metadata.publishedAt}
        image={metadata.images?.[0] || metadata.image}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      <article className={styles.article}>
        <header className={styles.header}>
          <div className={styles.container}>
            <Link href="/work" className={styles.back}>
              <Icon name="arrowLongRight" size="s" className={styles.backArrow} />
              All projects
            </Link>

            <div className={styles.meta}>
              {metadata.kind && <span>{metadata.kind}</span>}
              {metadata.year && <span className={styles.metaDivider}>{metadata.year}</span>}
            </div>

            <Reveal variant="up">
              <h1 className={styles.title}>{metadata.brand || metadata.title}</h1>
            </Reveal>

            {metadata.subtitle && (
              <Reveal variant="up" delay={0.06}>
                <p className={styles.subtitle}>{metadata.subtitle}</p>
              </Reveal>
            )}

            <Reveal variant="up" delay={0.12}>
              <p className={styles.summary}>{metadata.summary}</p>
            </Reveal>

            {metadata.link && (
              <Reveal variant="up" delay={0.18} className={styles.headerAction}>
                <CTA href={metadata.link} variant="secondary" external>
                  Visit live site
                </CTA>
              </Reveal>
            )}
          </div>
        </header>

        {cover && (
          <Reveal variant="mask" className={styles.coverWrap}>
            <div className={styles.cover}>
              {isVideo(cover) ? (
                <video
                  className={styles.coverMedia}
                  src={cover}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label={metadata.title}
                />
              ) : (
                <Image
                  src={cover}
                  alt={`${metadata.title} interface`}
                  fill
                  className={styles.coverMedia}
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                />
              )}
            </div>
          </Reveal>
        )}

        <div className={styles.container}>
          <div className={styles.layout}>
            <div className={styles.content}>
              <CustomMDX source={post.content} />
            </div>

            <aside className={styles.sidebar} aria-label="Project details">
              <div className={styles.sidebarInner}>
                {metadata.role && (
                  <div className={styles.factGroup}>
                    <h2 className={styles.factLabel}>Role</h2>
                    <p className={styles.factValue}>{metadata.role}</p>
                  </div>
                )}

                {metadata.services && metadata.services.length > 0 && (
                  <div className={styles.factGroup}>
                    <h2 className={styles.factLabel}>Scope</h2>
                    <ul className={styles.factList}>
                      {metadata.services.map((service) => (
                        <li key={service}>{service}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {metadata.highlights && metadata.highlights.length > 0 && (
                  <div className={styles.factGroup}>
                    <h2 className={styles.factLabel}>Key features</h2>
                    <ul className={styles.factList}>
                      {metadata.highlights.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {metadata.stack && metadata.stack.length > 0 && (
                  <div className={styles.factGroup}>
                    <h2 className={styles.factLabel}>Built with</h2>
                    <ul className={styles.stack}>
                      {metadata.stack.map((item) => (
                        <li className={styles.stackItem} key={item}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>
          </div>

          {supporting.length > 0 && (
            <div className={styles.gallery}>
              {supporting.map((src, index) => (
                <Reveal variant="up" delay={index * 0.06} key={src} className={styles.galleryItem}>
                  {isVideo(src) ? (
                    <video
                      className={styles.galleryMedia}
                      src={src}
                      muted
                      loop
                      playsInline
                      controls
                      preload="none"
                      aria-label={`${metadata.title} walkthrough`}
                    />
                  ) : (
                    <Image
                      src={src}
                      alt={`${metadata.title} screen ${index + 2}`}
                      fill
                      className={styles.galleryMedia}
                      sizes="(max-width: 900px) 100vw, 50vw"
                      loading="lazy"
                    />
                  )}
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </article>

      <section className={styles.related}>
        <div className={styles.container}>
          <div className={styles.relatedHeader}>
            <h2 className={styles.relatedTitle}>Next project</h2>
            <CTA href="/work" variant="ghost">
              All projects
            </CTA>
          </div>
          <Projects exclude={[post.slug]} range={[1, 1]} />
        </div>
      </section>

      <ContactSection />
      <ScrollToHash />
    </>
  );
}
