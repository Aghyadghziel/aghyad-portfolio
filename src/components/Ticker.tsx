import styles from "./Ticker.module.scss";

/**
 * An infinite horizontal ticker. The items are rendered twice and the track
 * translates by half its width, so the loop is seamless. Pure CSS — no
 * JavaScript, and it pauses on hover and under reduced motion.
 */
export function Ticker({ items, className }: { items: string[]; className?: string }) {
  const row = [...items, ...items];
  return (
    <div className={`${styles.ticker} ${className ?? ""}`} aria-label={items.join(", ")}>
      <div className={styles.track} aria-hidden="true">
        {row.map((item, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: the list is static and duplicated on purpose.
          <span key={index} className={styles.item}>
            {item}
            <span className={styles.dot} />
          </span>
        ))}
      </div>
    </div>
  );
}
