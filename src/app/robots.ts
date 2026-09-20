import { baseURL, routes } from "@/resources";

/**
 * Routes turned off in the config still resolve over HTTP and render the
 * not-found view client-side, which reads to a crawler as a soft 404. Listing
 * them here keeps them out of the index without needing a redirect.
 */
function disabledPaths(): string[] {
  return Object.entries(routes)
    .filter(([, enabled]) => !enabled)
    .map(([path]) => path);
}

export default function robots() {
  const disallow = disabledPaths();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        ...(disallow.length > 0 ? { disallow } : {}),
      },
    ],
    sitemap: `${baseURL}/sitemap.xml`,
  };
}
