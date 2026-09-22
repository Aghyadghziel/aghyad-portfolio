import type {
  DataStyleConfig,
  DisplayConfig,
  EffectsConfig,
  FontsConfig,
  ProtectedRoutesConfig,
  RoutesConfig,
  SameAsConfig,
  SchemaConfig,
  SocialSharingConfig,
  StyleConfig,
} from "@/types";
import { home, person } from "./content";

/**
 * Public site origin, used for canonical URLs, OG tags, sitemap and schema.
 * Set NEXT_PUBLIC_SITE_URL in the environment once the domain is live.
 */
const baseURL: string =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const routes: RoutesConfig = {
  "/": true,
  "/about": true,
  "/work": true,
  "/blog": false,
  "/gallery": false,
};

const display: DisplayConfig = {
  location: false,
  time: false,
  themeSwitcher: false,
};

/** Password-protected routes. Set the password in .env — see .env.example. */
const protectedRoutes: ProtectedRoutesConfig = {};

import { Barlow, Barlow_Condensed, Geist_Mono } from "next/font/google";

/** Display — condensed and heavy, set uppercase by the display utilities. */
const heading = Barlow_Condensed({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

/** Body and UI labels. */
const body = Barlow({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const label = Barlow({
  variable: "--font-label",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

/** Small mono metadata labels. Never in the first paint's critical text. */
const code = Geist_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
  preload: false,
});

const fonts: FontsConfig = {
  heading: heading,
  body: body,
  label: label,
  code: code,
};

// default customization applied to the HTML in the main layout.tsx
const style: StyleConfig = {
  theme: "dark", // dark only — the palette in custom.css is built for ink
  neutral: "gray", // remapped in custom.css; kept so the template tokens resolve
  brand: "blue", // remapped in custom.css to the cool accent
  accent: "blue",
  solid: "contrast", // color | contrast
  solidStyle: "flat", // flat | plastic
  border: "conservative", // tighter radii read as more editorial than "playful"
  surface: "filled", // filled | translucent
  transition: "all", // all | micro | macro
  scaling: "100", // 90 | 95 | 100 | 105 | 110
};

const dataStyle: DataStyleConfig = {
  variant: "flat",
  mode: "categorical",
  height: 24,
  axis: {
    stroke: "var(--neutral-alpha-weak)",
  },
  tick: {
    fill: "var(--neutral-on-background-weak)",
    fontSize: 11,
    line: false,
  },
};

/**
 * Page background effects. Kept deliberately minimal — the visual interest
 * comes from typography and layout, not from decorative background layers.
 */
const effects: EffectsConfig = {
  mask: {
    cursor: false,
    x: 50,
    y: 0,
    radius: 100,
  },
  gradient: {
    display: false,
    opacity: 100,
    x: 50,
    y: 60,
    width: 100,
    height: 50,
    tilt: 0,
    colorStart: "accent-background-strong",
    colorEnd: "page-background",
  },
  dots: {
    display: false,
    opacity: 40,
    size: "2",
    color: "brand-background-strong",
  },
  grid: {
    display: false,
    opacity: 100,
    color: "neutral-alpha-medium",
    width: "0.25rem",
    height: "0.25rem",
  },
  lines: {
    display: false,
    opacity: 100,
    color: "neutral-alpha-weak",
    size: "16",
    thickness: 1,
    angle: 45,
  },
};

// Structured data describing the practice
const schema: SchemaConfig = {
  logo: `${baseURL}${person.avatar}`,
  type: "Person",
  name: person.name,
  description: home.description,
  email: person.email,
};

// Profiles referenced in structured data
const sameAs: SameAsConfig = {
  linkedin: "https://www.linkedin.com/in/aghyadghziel/",
  github: "https://github.com/Aghyadghziel",
};

// social sharing configuration for articles
const socialSharing: SocialSharingConfig = {
  display: true,
  platforms: {
    x: true,
    linkedin: true,
    facebook: false,
    pinterest: false,
    whatsapp: true,
    reddit: false,
    telegram: false,
    email: true,
    copyLink: true,
  },
};

export {
  display,
  routes,
  protectedRoutes,
  baseURL,
  fonts,
  style,
  schema,
  sameAs,
  socialSharing,
  effects,
  dataStyle,
};
