import Link from "next/link";
import { Icon } from "@once-ui-system/core";
import { person, social } from "@/resources";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Footer.module.scss";

const FOOTER_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/work" },
  { label: "Contact", href: "/#contact" },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.identity}>
            <Link href="/" className={styles.wordmark}>
              <span className={styles.mark} aria-hidden="true" />
              {person.name}
            </Link>
            <p className={styles.role}>{person.role}</p>
          </div>

          <nav className={styles.nav} aria-label="Footer">
            <p className={styles.columnLabel}>Site</p>
            <ul className={styles.list}>
              {FOOTER_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.contactColumn}>
            <p className={styles.columnLabel}>Contact</p>
            <ul className={styles.list}>
              <li>
                <a href={`mailto:${person.email}`} className={styles.link}>
                  {person.email}
                </a>
              </li>
              <li>
                <a
                  href={social.find((item) => item.name === "LinkedIn")?.link}
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  linkedin.com/in/aghyadghziel
                </a>
              </li>
            </ul>
            <div className={styles.socials}>
              {social.map((item) => (
                <a
                  key={item.name}
                  href={item.link}
                  aria-label={item.name}
                  className={styles.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name={item.icon} size="s" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.legal}>
            © {currentYear} {person.name}
            <span className={styles.legalDivider} aria-hidden="true">
              /
            </span>
            {/* Attribution required by the Once UI template licence. */}
            <span className={styles.attribution}>
              Built on{" "}
              <a
                href="https://once-ui.com/products/magic-portfolio"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.attributionLink}
              >
                Once UI
              </a>
            </span>
          </p>
          <div className={styles.themeToggle}>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
};
