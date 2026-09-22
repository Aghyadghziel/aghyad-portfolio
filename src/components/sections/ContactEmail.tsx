"use client";

import { useEffect, useState } from "react";
import classNames from "classnames";
import styles from "./ContactEmail.module.scss";

/**
 * The email address as the biggest thing on the contact block. Clicking it
 * copies the address and says so; the link still works as a mailto for
 * anyone who prefers their mail app.
 */
export function ContactEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  const copy = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!navigator.clipboard) return; // falls through to the mailto
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  const [user, domain] = email.split("@");

  return (
    <a href={`mailto:${email}`} onClick={copy} className={styles.link} aria-live="polite">
      <span className={styles.text}>
        {user}
        <span className={styles.at}>@</span>
        {domain}
      </span>
      <span className={classNames(styles.hint, copied && styles.hintOn)}>
        {copied ? "Copied to clipboard" : "Click to copy"}
      </span>
    </a>
  );
}
