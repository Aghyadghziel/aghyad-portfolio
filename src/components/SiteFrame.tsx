"use client";

import { usePathname } from "next/navigation";
import { Cursor } from "@/components/Cursor";
import { RouteGuard } from "@/components/RouteGuard";
import { SiteNav } from "@/components/SiteNav";
import { SmoothScroll } from "@/components/SmoothScroll";

/**
 * Public chrome around the page.
 *
 * The admin area (/admin) is a separate surface: it takes no site navigation,
 * no custom cursor and no footer, and it must bypass `RouteGuard`, whose route
 * table only lists public pages.
 */
export function SiteFrame({ footer, children }: { footer: React.ReactNode; children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = Boolean(pathname?.startsWith("/admin"));

  if (isAdmin) return <main id="main">{children}</main>;

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SiteNav />
      <Cursor />
      <SmoothScroll />
      {/* A plain <main>, not a centred flex column: `align-items: center`
          shrinks each section to its content width, so sections stop
          sharing a left edge and headings drift out of alignment. */}
      <main id="main" className="site-main">
        <RouteGuard>{children}</RouteGuard>
      </main>
      {footer}
    </>
  );
}
