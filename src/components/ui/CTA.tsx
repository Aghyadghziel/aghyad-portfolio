"use client";

import Link from "next/link";
import classNames from "classnames";
import { Icon } from "@once-ui-system/core";
import { Magnetic } from "@/components/motion/Magnetic";
import type { IconName } from "@/resources/icons";
import styles from "./CTA.module.scss";

interface CTAProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "s" | "m" | "l";
  /** Opens in a new tab and adds the right rel attributes. */
  external?: boolean;
  /** Leading icon, e.g. "whatsapp". */
  icon?: IconName;
  /** Trailing up-right arrow. */
  arrow?: boolean;
  /** Wraps the button in a magnetic field on pointer devices. */
  magnetic?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * The site's call-to-action link: a pill whose label rolls up on hover,
 * with an optional arrow that nudges up and right. Only `transform` and
 * colour change, so the interaction stays on the compositor.
 */
export function CTA({
  href,
  children,
  variant = "primary",
  size = "m",
  external = false,
  icon,
  arrow = false,
  magnetic = true,
  className,
  onClick,
}: CTAProps) {
  const isHashLink = href.startsWith("#") || href.startsWith("/#");
  const isExternal = external || /^(https?:|mailto:|tel:)/.test(href);
  const externalProps =
    isExternal && !href.startsWith("mailto:")
      ? { target: "_blank", rel: "noopener noreferrer" as const }
      : undefined;

  const content = (
    <>
      {icon && <Icon name={icon} size="s" className={styles.icon} />}
      <span className={styles.label}>
        <span className={styles.text}>{children}</span>
        <span className={styles.textGhost} aria-hidden="true">
          {children}
        </span>
      </span>
      {arrow && (
        <span className={styles.arrow} aria-hidden="true">
          <Icon name="arrowUpRight" size="s" />
        </span>
      )}
    </>
  );

  const classes = classNames(styles.cta, styles[variant], styles[size], className);

  // Plain <a> for hash and external targets; next/link for real routes.
  const button =
    isHashLink || isExternal ? (
      <a href={href} className={classes} onClick={onClick} data-cursor="open" {...externalProps}>
        {content}
      </a>
    ) : (
      <Link href={href} className={classes} onClick={onClick} data-cursor="open">
        {content}
      </Link>
    );

  return magnetic ? (
    <Magnetic strength={0.22} max={10}>
      {button}
    </Magnetic>
  ) : (
    button
  );
}
