import "@once-ui-system/core/css/styles.css";
import "@once-ui-system/core/css/tokens.css";
import "@/resources/custom.css";

import classNames from "classnames";

import { Column, Flex, Meta } from "@once-ui-system/core";
import { Footer, Providers, RouteGuard, SiteNav } from "@/components";
import { baseURL, dataStyle, fonts, home, style } from "@/resources";

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Flex
      suppressHydrationWarning
      as="html"
      lang="en"
      fillWidth
      className={classNames(
        fonts.heading.variable,
        fonts.body.variable,
        fonts.label.variable,
        fonts.code.variable,
      )}
    >
      <head>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const root = document.documentElement;

                  // Set defaults from config
                  const config = ${JSON.stringify({
                    brand: style.brand,
                    accent: style.accent,
                    neutral: style.neutral,
                    solid: style.solid,
                    "solid-style": style.solidStyle,
                    border: style.border,
                    surface: style.surface,
                    transition: style.transition,
                    scaling: style.scaling,
                    "viz-style": dataStyle.variant,
                  })};

                  // Apply default values
                  Object.entries(config).forEach(([key, value]) => {
                    root.setAttribute('data-' + key, value);
                  });

                  // Resolve theme
                  const resolveTheme = (themeValue) => {
                    if (!themeValue || themeValue === 'system') {
                      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    }
                    return themeValue;
                  };

                  // Seed the configured default on a first visit. Writing it to
                  // storage (rather than only to the DOM) is what makes the theme
                  // stick: the provider reads storage on mount and would otherwise
                  // fall back to the operating system preference.
                  let savedTheme = localStorage.getItem('data-theme');
                  if (!savedTheme) {
                    savedTheme = resolveTheme('${style.theme}');
                    localStorage.setItem('data-theme', savedTheme);
                  }
                  root.setAttribute('data-theme', resolveTheme(savedTheme));

                  // Apply any saved style overrides
                  const styleKeys = Object.keys(config);
                  styleKeys.forEach(key => {
                    const value = localStorage.getItem('data-' + key);
                    if (value) {
                      root.setAttribute('data-' + key, value);
                    }
                  });
                } catch (e) {
                  console.error('Failed to initialize theme:', e);
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <Providers>
        <Column
          as="body"
          background="page"
          fillWidth
          style={{ minHeight: "100vh" }}
          margin="0"
          padding="0"
          horizontal="center"
        >
          {/* Lets keyboard users jump straight past the navigation. */}
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <SiteNav />
          {/* A plain <main>, not a centred flex column: `align-items: center`
              shrinks each section to its content width, so sections stop
              sharing a left edge and headings drift out of alignment. */}
          <main id="main" className="site-main">
            <RouteGuard>{children}</RouteGuard>
          </main>
          <Footer />
        </Column>
      </Providers>
    </Flex>
  );
}
