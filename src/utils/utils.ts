import fs from "fs";
import path from "path";
import matter from "gray-matter";

type Team = {
  name: string;
  role: string;
  avatar: string;
  linkedIn: string;
};

type Metadata = {
  title: string;
  subtitle?: string;
  publishedAt: string;
  summary: string;
  image?: string;
  images: string[];
  tag?: string;
  team: Team[];
  link?: string;
  /** Brand or company the work was for, e.g. "Bagel Labs". */
  brand?: string;
  /** What the project is, in a few words, e.g. "AI SaaS platform". */
  kind?: string;
  /** Role held on the project, e.g. "Frontend Lead". */
  role?: string;
  /** Year or range shown on the case study, e.g. "2024 — 2025". */
  year?: string;
  /** Short list of what was delivered. */
  services?: string[];
  /** Key technologies, shown only where they are relevant. */
  stack?: string[];
  /** Notable capabilities built, for the case study summary block. */
  highlights?: string[];
  /** One line describing the visual direction taken. */
  direction?: string;
  /** Pins the project to the top of the work list. */
  featured?: boolean;
  /**
   * Explicit position in the work list, lowest first. Projects with an order
   * come before everything else; the rest fall back to featured, then date.
   */
  order?: number;
};

import { notFound } from "next/navigation";

function getMDXFiles(dir: string) {
  if (!fs.existsSync(dir)) {
    notFound();
  }

  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);

  const metadata: Metadata = {
    title: data.title || "",
    subtitle: data.subtitle || "",
    publishedAt: data.publishedAt,
    summary: data.summary || "",
    image: data.image || "",
    images: data.images || [],
    tag: data.tag || [],
    team: data.team || [],
    link: data.link || "",
    brand: data.brand || "",
    kind: data.kind || "",
    role: data.role || "",
    year: data.year || "",
    services: data.services || [],
    stack: data.stack || [],
    highlights: data.highlights || [],
    direction: data.direction || "",
    featured: data.featured ?? false,
    order: typeof data.order === "number" ? data.order : undefined,
  };

  return { metadata, content };
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));
    const slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });
}

export function getPosts(customPath = ["", "", "", ""]) {
  const postsDir = path.join(process.cwd(), ...customPath);
  return getMDXData(postsDir);
}
