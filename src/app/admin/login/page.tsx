import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getAdmin } from "@/lib/server/auth";
import styles from "../admin.module.scss";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  await connection();
  const configured = Boolean(process.env.DATABASE_URL);
  if (configured && (await getAdmin())) redirect("/admin");

  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginCard}>
        <p className={styles.eyebrow}>AGHYAD · ADMIN</p>
        <h1 className={styles.loginTitle}>Sign in</h1>
        <p className={styles.mute}>Enter your admin email and a one-time code is sent to it.</p>
        {configured ? (
          <LoginForm />
        ) : (
          <p className={styles.notice}>
            The database isn&apos;t connected yet. Add <code>DATABASE_URL</code> to the environment, then reload.
          </p>
        )}
      </div>
    </div>
  );
}
