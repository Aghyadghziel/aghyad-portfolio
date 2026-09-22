import styles from "./template.module.scss";

/**
 * Re-mounts on every navigation, so the page content can play a short
 * enter animation — a fade and a lift — without a client-side router hook.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className={styles.enter}>{children}</div>;
}
