"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import { Icon } from "@once-ui-system/core";
import { person, social } from "@/resources";
import { CTA } from "@/components/ui/CTA";
import styles from "./SiteNav.module.scss";

type NavItem = {
  label: string;
  /** Anchor id on the home page, when the item is a section. */
  id?: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", id: "top" },
  { label: "About", href: "/#about", id: "about" },
  { label: "Experience", href: "/#experience", id: "experience" },
  { label: "Projects", href: "/#projects", id: "projects" },
  { label: "Contact", href: "/#contact", id: "contact" },
];

/**
 * Primary navigation.
 *
 * Sticky, with the current section marked as you scroll. Section tracking uses
 * one IntersectionObserver over all sections rather than a scroll handler, so
 * it costs nothing per frame. Off the home page the observer finds no sections
 * and the bar simply marks the current route instead.
 */
export function SiteNav() {
  const pathname = usePathname() ?? "/";
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeId, setActiveId] = useState<string>("top");
  const [menuOpen, setMenuOpen] = useState(false);
  const ticking = useRef(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Background appears once the page leaves the top.
  //
  // This handler also claims the "Home" item near the top of the page. The
  // section observer cannot do it: scrolling up, the first section leaves the
  // detection band while the page is still a few hundred pixels down, so its
  // last callback fires too early to conclude the hero is back in view.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 16);
        // Slip away while reading downward, return on the first upward move.
        if (y > 160 && y > last + 4) setHidden(true);
        else if (y < last - 4 || y <= 160) setHidden(false);
        last = y;
        if (y < 120) setActiveId("top");
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track which section is in view, on the home page only.
  useEffect(() => {
    if (!isHome) return;

    const sections = NAV_ITEMS.map((item) => item.id)
      .filter((id): id is string => Boolean(id) && id !== "top")
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // The entry closest to the top of the viewport wins, so the marker
        // does not flicker when two sections are visible at once.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        } else if (window.scrollY < 120) {
          setActiveId("top");
        }
      },
      // A band across the upper middle of the viewport: a section counts as
      // current once its content, not just its top edge, is on screen.
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [isHome]);

  // Close the menu whenever the route changes. The effect body does not read
  // `pathname` — the dependency *is* the signal, which covers browser back and
  // forward navigation as well as taps on the menu links.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger, not an input.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // While the menu is open: lock the page behind it and allow Escape to close.
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    // Return focus to the control that opened the menu.
    toggleRef.current?.focus();
  }, []);

  const isActive = (item: NavItem) => {
    if (isHome) return item.id === activeId;
    // The section links point at home anchors, so match on the route instead.
    if (pathname.startsWith("/about")) return item.id === "about";
    if (pathname.startsWith("/work")) return item.id === "projects";
    return false;
  };

  return (
    <>
      <header
        className={classNames(
          styles.header,
          scrolled && styles.scrolled,
          hidden && !menuOpen && styles.hidden,
        )}
      >
        <div className={styles.inner}>
          <Link href="/" className={styles.wordmark} aria-label={`${person.name} — home`}>
            <span className={styles.mark} aria-hidden="true" />
            <span className={styles.wordmarkText}>{person.name}</span>
          </Link>

          <nav className={styles.nav} aria-label="Primary">
            <ul className={styles.navList}>
              {NAV_ITEMS.map((item) => {
                const active = isActive(item);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={classNames(styles.navLink, active && styles.navLinkActive)}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className={styles.actions}>
            <span className={styles.status}>
              <span className={styles.statusDot} aria-hidden="true" />
              Available
            </span>
            <div className={styles.desktopCta}>
              <CTA href="/#contact" variant="primary" size="s" magnetic={false}>
                Get in touch
              </CTA>
            </div>
            <button
              ref={toggleRef}
              type="button"
              className={styles.menuButton}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className={styles.menuButtonLabel}>{menuOpen ? "Close" : "Menu"}</span>
              <span className={classNames(styles.burger, menuOpen && styles.burgerOpen)}>
                <span className={styles.burgerBar} />
                <span className={styles.burgerBar} />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu */}
      <div
        id="mobile-menu"
        className={classNames(styles.menu, menuOpen && styles.menuOpen)}
        inert={!menuOpen || undefined}
      >
        <nav className={styles.menuNav} aria-label="Mobile">
          <ul className={styles.menuList}>
            {NAV_ITEMS.map((item, index) => (
              <li
                className={styles.menuItem}
                key={item.href}
                style={{ transitionDelay: menuOpen ? `${0.2 + index * 0.06}s` : "0s" }}
              >
                <Link href={item.href} className={styles.menuLink} onClick={closeMenu}>
                  <span className={styles.menuLabel}>{item.label}</span>
                  <span className={styles.menuIndex}>0{index + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.menuFooter}>
          <CTA
            href="/#contact"
            variant="primary"
            magnetic={false}
            onClick={closeMenu}
            className={styles.menuCta}
          >
            Get in touch
          </CTA>
          <div className={styles.menuSocial}>
            {social.map((item) => (
              <a
                key={item.name}
                href={item.link}
                aria-label={item.name}
                className={styles.menuSocialLink}
                onClick={closeMenu}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name={item.icon} size="s" />
                <span>{item.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
