"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";
import styles from "../admin.module.scss";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  const onCode = state?.step === "code";

  return (
    <div className={styles.loginForm}>
      {!onCode ? (
        <form action={action}>
          <input type="hidden" name="intent" value="send" />
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="you@gmail.com"
            defaultValue={state?.email}
            className={styles.input}
          />
          <button type="submit" disabled={pending} className={styles.primaryButton}>
            {pending ? "Sending…" : "Send code"}
          </button>
        </form>
      ) : (
        <form action={action}>
          <input type="hidden" name="intent" value="verify" />
          <input type="hidden" name="email" value={state.email} />
          <p className={styles.mute}>
            Code sent to <strong>{state.email}</strong> if it&apos;s an admin email.
          </p>
          <label htmlFor="code" className={styles.label}>
            6-digit code
          </label>
          <input
            id="code"
            name="code"
            required
            autoFocus
            autoComplete="one-time-code"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="••••••"
            className={`${styles.input} ${styles.codeInput}`}
          />
          <button type="submit" disabled={pending} className={styles.primaryButton}>
            {pending ? "Checking…" : "Sign in"}
          </button>
          <button type="submit" name="intent" value="reset" formNoValidate className={styles.linkButton}>
            Use a different email
          </button>
        </form>
      )}
      {state?.message && (
        <p role="status" className={state.ok ? styles.mute : styles.error}>
          {state.message}
        </p>
      )}
    </div>
  );
}
