import type { About, Blog, Capabilities, Contact, Home, Person, Social, Work } from "@/types";

const person: Person = {
  firstName: "Aghyad",
  lastName: "Ghziel",
  name: `Aghyad Ghziel`,
  role: "Full-Stack Developer",
  avatar: "/images/avatar.jpg",
  email: "aghyadghziel@gmail.com",
  location: "Asia/Tbilisi", // IANA time zone identifier
  languages: ["Arabic", "English", "Russian"],
};

/** Digits only, international format — used to build the wa.me link. */
const whatsappNumber = "966592655067";
/** Human-readable version of the same number. */
const whatsappDisplay = "+966 59 265 5067";
const calendarLink = "https://calendly.com/aghyadghziel/meeting";
const linkedInUrl = "https://www.linkedin.com/in/aghyadghziel/";
const githubUrl = "https://github.com/Aghyadghziel";

const social: Social = [
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: linkedInUrl,
    essential: true,
  },
  {
    name: "GitHub",
    icon: "github",
    link: githubUrl,
    essential: true,
  },
  {
    name: "WhatsApp",
    icon: "whatsapp",
    link: `https://wa.me/${whatsappNumber}`,
    essential: false,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.png",
  label: "Home",
  title: `${person.name} — Full-Stack Developer`,
  description:
    "Full-stack developer with a frontend focus, building production web applications with React, Next.js, TypeScript and Node.js.",
  hero: {
    eyebrow: "Full-stack developer · Riyadh",
    lines: ["Web products that", "feel *considered*."],
    subline: (
      <>
        I build production web applications end to end — interface, API and database. Two years
        shipping SaaS platforms with real users and payments, and now my own studio building
        Arabic-first sites with real-time 3D.
      </>
    ),
    primary: { label: "See the work", href: "#projects" },
    secondary: { label: "Say hi", href: "#contact" },
    stack: ["React", "Next.js", "TypeScript", "Node.js", "Three.js"],
    now: "Founder & developer at SIMA Studio. Open to full-stack and frontend roles, and to freelance work.",
  },
};

const capabilities: Capabilities = {
  display: true,
  id: "stack",
  eyebrow: "04 — Stack",
  title: "What I *build* with.",
  description: (
    <>
      Day to day I work across the whole stack, with most of my depth on the front end — and, on
      studio work, on real-time 3D and motion in the browser.
    </>
  ),
  groups: [
    {
      title: "Frontend",
      description: "Where most of my work happens.",
      tags: [
        { name: "React", icon: "react" },
        { name: "Next.js", icon: "nextjs" },
        { name: "TypeScript", icon: "typescript" },
        { name: "Tailwind CSS", icon: "tailwindcss" },
      ],
    },
    {
      title: "Backend & data",
      description: "APIs, authentication, storage and schema design.",
      tags: [
        { name: "Node.js", icon: "nodejs" },
        { name: "Express", icon: "express" },
        { name: "SQL", icon: "database" },
        { name: "Prisma", icon: "prisma" },
        { name: "AWS", icon: "aws" },
      ],
    },
    {
      title: "Payments & design",
      description: "Billing flows in production, and design-to-code work.",
      tags: [
        { name: "Stripe", icon: "stripe" },
        { name: "PayPal", icon: "paypal" },
        { name: "Figma", icon: "figma" },
      ],
    },
    {
      title: "3D & motion",
      description: "Real-time scenes and scroll-driven interfaces, kept inside a frame budget.",
      tags: [
        { name: "Three.js", icon: "threejs" },
        { name: "React Three Fiber", icon: "react" },
        { name: "GSAP", icon: "gsap" },
      ],
    },
  ],
};

const contact: Contact = {
  display: true,
  id: "contact",
  eyebrow: "05 — Contact",
  title: "Let’s *talk*.",
  description: (
    <>
      Open to full-stack and frontend roles, and to freelance work. The quickest way to reach me is
      email — I reply to everything.
    </>
  ),
  channels: [
    {
      name: "Email",
      value: person.email,
      hint: "Best for roles and details",
      href: `mailto:${person.email}`,
      icon: "email",
    },
    {
      name: "LinkedIn",
      value: "in/aghyadghziel",
      hint: "Experience and network",
      href: linkedInUrl,
      icon: "linkedin",
      external: true,
    },
    {
      name: "GitHub",
      value: "Aghyadghziel",
      hint: "Code and side projects",
      href: githubUrl,
      icon: "github",
      external: true,
    },
  ],
  primary: { label: "Email me", href: `mailto:${person.email}` },
  secondary: { label: "Connect on LinkedIn", href: linkedInUrl, external: true },
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `${person.name} is a full-stack developer with a frontend focus, working with React, Next.js, TypeScript and Node.js.`,
  tableOfContent: {
    display: false,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: calendarLink,
  },
  intro: {
    display: true,
    title: "About",
    description: (
      <>
        I am a full-stack developer with a Computer Science degree and most of my depth on the
        front end. I spent two years on SaaS products for startups — AI model tooling at Bagel
        Labs, where I led the front end, and a two-sided marketplace at Alpha Factory, both with
        real users, subscription billing and role-based access. I now run SIMA Studio, my own
        design and development studio building Arabic-first websites for Saudi companies, where
        the work adds real-time 3D, motion and bilingual RTL on top of the same stack.
      </>
    ),
  },
  work: {
    display: true,
    title: "Experience",
    experiences: [
      {
        company: "SIMA Studio",
        timeframe: "Jan 2026 — Present",
        role: "Founder · Design & Development",
        achievements: [
          <>
            Founded SIMA Studio, a design and development studio building Arabic-first websites
            for Saudi companies and brands.
          </>,
          <>
            Delivered NASAQ, a B2B uniform manufacturer's website: a new visual identity, a 3D
            garment built from a real sewing pattern, and a configurator that feeds the quote
            request.
          </>,
          <>
            Designed and built the studio's own site — bilingual Arabic and English with full
            RTL, case studies and published pricing.
          </>,
          <>
            Built a first-party, cookieless analytics and lead pipeline on Postgres with Resend
            notifications, behind an admin dashboard.
          </>,
          <>
            Produced concept projects (LIWAN, NOBLE Immersive, Rashfa) exploring real-time 3D,
            scroll-driven storytelling and mobile performance budgets.
          </>,
        ],
        technologies: [
          "Next.js",
          "React",
          "TypeScript",
          "React Three Fiber",
          "Three.js",
          "GSAP",
          "Postgres",
          "Tailwind CSS",
        ],
        images: [
          {
            src: "/images/projects/sima/hero.jpg",
            alt: "SIMA Studio website",
            width: 16,
            height: 10,
          },
        ],
      },
      {
        company: "Bagel Labs",
        timeframe: "Jan 2024 — Sep 2025",
        role: "Senior Fullstack Developer · Frontend Lead",
        achievements: [
          <>
            Led the front-end architecture of a SaaS platform for fine-tuning and deploying AI
            image and video models, including VEO 3 and Flux.
          </>,
          <>
            Built authentication and authorization with NextAuth.js, OAuth providers and
            role-based access control.
          </>,
          <>Integrated Stripe for subscriptions, billing workflows and transaction handling.</>,
          <>
            Implemented model deployment and fine-tuning workflows with real-time status
            monitoring.
          </>,
          <>
            Built dataset upload, processing and validation pipelines on AWS S3 and DynamoDB.
          </>,
          <>Shipped an admin console for user management, monitoring and operations.</>,
        ],
        technologies: [
          "Next.js",
          "React",
          "TypeScript",
          "NextAuth.js",
          "Stripe",
          "AWS S3",
          "DynamoDB",
          "Radix UI",
        ],
        images: [
          {
            src: "/images/projects/project-01/cover-04.png",
            alt: "Bagel Labs platform interface",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Alpha Factory",
        timeframe: "Aug 2025 — Dec 2025",
        role: "Fullstack Developer",
        achievements: [
          <>
            Built a two-sided collaboration platform connecting influencers with designers and
            video editors.
          </>,
          <>
            Developed role-specific dashboards for four user types, each with its own permissions
            and workflow.
          </>,
          <>Integrated PayPal and cryptocurrency payments for project-based transactions.</>,
          <>Built an admin panel for moderation, user management and dispute handling.</>,
          <>
            Designed secure upload and storage pipelines for large video assets, with Prisma
            modelling the data.
          </>,
        ],
        technologies: [
          "Next.js",
          "React",
          "TypeScript",
          "Node.js",
          "Prisma",
          "PayPal API",
          "Tailwind CSS",
        ],
        images: [
          {
            src: "/images/projects/project-01/image-02.png",
            alt: "Alpha Factory platform interface",
            width: 16,
            height: 9,
          },
        ],
      },
    ],
  },
  studies: {
    display: true,
    title: "Education",
    institutions: [
      {
        name: "Kazan Federal University",
        description: <>Bachelor of Science in Computer Science.</>,
      },
      {
        name: "Fullstack Development",
        description: (
          <>Professional coursework in React, Node.js, Express, SQL/NoSQL and Tailwind CSS.</>
        ),
      },
    ],
  },
  technical: {
    display: true,
    title: "Technical skills",
    skills: [
      {
        title: "Frontend",
        description: (
          <>
            Component architecture, accessibility and responsive interfaces in React and Next.js,
            working from Figma designs.
          </>
        ),
        tags: [
          { name: "React", icon: "react" },
          { name: "Next.js", icon: "nextjs" },
          { name: "TypeScript", icon: "typescript" },
          { name: "Tailwind CSS", icon: "tailwindcss" },
          { name: "Figma", icon: "figma" },
        ],
      },
      {
        title: "Backend & infrastructure",
        description: (
          <>
            APIs, authentication, database modelling and cloud storage with Node.js, Express,
            Prisma and AWS.
          </>
        ),
        tags: [
          { name: "Node.js", icon: "nodejs" },
          { name: "Express", icon: "express" },
          { name: "SQL", icon: "database" },
          { name: "Prisma", icon: "prisma" },
          { name: "AWS", icon: "aws" },
        ],
      },
      {
        title: "Payments",
        description: (
          <>Subscription billing and marketplace payouts shipped to production.</>
        ),
        tags: [
          { name: "Stripe", icon: "stripe" },
          { name: "PayPal", icon: "paypal" },
        ],
      },
      {
        title: "3D & motion",
        description: (
          <>
            Real-time scenes and scroll-driven interfaces in React Three Fiber and GSAP, built to
            hold their frame budget on a mid-range phone.
          </>
        ),
        tags: [
          { name: "Three.js", icon: "threejs" },
          { name: "React Three Fiber", icon: "react" },
          { name: "GSAP", icon: "gsap" },
        ],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Writing",
  title: "Notes on building for the web",
  description: `Occasional writing by ${person.name}`,
};

const work: Work = {
  path: "/work",
  label: "Projects",
  title: `Projects`,
  description: `Web applications designed and built by ${person.name}.`,
};

export {
  person,
  social,
  home,
  capabilities,
  contact,
  about,
  blog,
  work,
  whatsappNumber,
  whatsappDisplay,
  calendarLink,
  linkedInUrl,
  githubUrl,
};
