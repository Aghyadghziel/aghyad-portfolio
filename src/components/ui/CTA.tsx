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
  /** Wraps the button in a magnetic field on pointer devices. */
  magnetic?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * The site's call-to-action link.
 *
 * Carries two deliberate micro-interactions: the label and arrow shift right
 * together on hover, and a solid panel wipes up behind the label. Both are
 * pure `transform` changes so they stay on the compositor.
 */
export function CTA({
  href,
  children,
  variant = "primary",
  size = "m",
  external = false,
  icon,
  magnetic = true,
  className,
  onClick,
}: CTAProps) {
  const isHashLink = href.startsWith("#");
  const externalProps = external
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : undefined;

  const content = (
    <>
      <span className={styles.fill} aria-hidden="true" />
      <span className={styles.label}>
        {icon && <Icon name={icon} size="s" className={styles.icon} />}
        <span className={styles.text}>{children}</span>
        <span className={styles.arrow} aria-hidden="true">
          <Icon name="arrowLongRight" size="s" />
        </span>
      </span>
    </>
  );

  const classes = classNames(styles.cta, styles[variant], styles[size], className);

  // Plain <a> for hash and external targets; next/link for real routes.
  const button =
    isHashLink || external ? (
      <a href={href} className={classes} onClick={onClick} {...externalProps}>
        {content}
      </a>
    ) : (
      <Link href={href} className={classes} onClick={onClick}>
        {content}
      </Link>
    );

  return magnetic ? <Magnetic strength={0.22} max={10}>{button}</Magnetic> : button;
}
