import type { Metadata } from "next";
import styles from "./admin.module.scss";

export const metadata: Metadata = {
  title: "Admin · Aghyad Ghziel",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

/**
 * The admin area sits inside the site's root layout, so it only claims its own
 * dark surface. `Chrome` hides the public nav, cursor and footer on /admin.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className={styles.shell}>{children}</div>;
}
