import Image from "next/image";
import Link from "next/link";
import { Icon } from "@once-ui-system/core";
import { home } from "@/resources";
import { Reveal } from "@/components/motion/Reveal";
import { CTA } from "@/components/ui/CTA";
import { HeroLight } from "./HeroLight";
import { HeroWords } from "./HeroWords";
import { ProofVideo } from "./ProofVideo";
import styles from "./Hero.module.scss";

/**
 * Opening screen.
 *
 * One statement in display type over a field of light, two actions, and —
 * in the first screen, before anyone scrolls — the latest client site
 * moving, one tap from its case study. Proof before claims.
 */
export function Hero() {
  const { eyebrow, lines, subline, primary, secondary, stack, proof } = home.hero;

  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      {/* Backdrop: light, a dark pool behind the copy, a fade into the page, grain. */}
      <div className={styles.backdrop} aria-hidden="true">
        <HeroLight />
        <div className={styles.pool} />
        <div className={styles.fade} />
        <div className={`grain ${styles.grain}`} />
      </div>

      <div className={styles.container}>
        <Reveal variant="fade" delay={0.05} className={styles.kicker}>
          <span className={`bg-spectrum ${styles.kickerDot}`} aria-hidden="true" />
          {eyebrow}
        </Reveal>

        <HeroWords id="hero-heading" lines={lines} className={`display-xl ${styles.headline}`} />

        <Reveal variant="up" delay={0.4}>
          <p className={styles.subline}>{subline}</p>
        </Reveal>

        <Reveal variant="up" delay={0.5} className={styles.actions}>
          <CTA href={primary.href} variant="primary" arrow>
            {primary.label}
          </CTA>
          <CTA href={secondary.href} variant="secondary" className={styles.secondary}>
            {secondary.label}
          </CTA>
        </Reveal>

        <Reveal variant="fade" delay={0.6} className={styles.stack}>
          {stack.join("  ·  ")}
        </Reveal>

        {proof && (
          <Reveal variant="up" delay={0.65} className={styles.proofWrap}>
            <Link
              href={proof.href}
              data-cursor="view"
              aria-label={`${proof.label}: ${proof.name}`}
              className={styles.proof}
            >
              <span className={styles.proofBar}>
                <span className={styles.proofTitle}>
                  <span className={`bg-spectrum ${styles.kickerDot}`} aria-hidden="true" />
                  <span className={styles.proofLabel}>{proof.label}</span>
                  <span className={styles.proofName}>{proof.name}</span>
                </span>
                <span className={styles.proofDomain}>
                  <span className={styles.proofDomainText}>{proof.domain}</span>
                  <Icon name="arrowUpRight" size="s" className={styles.proofArrow} />
                </span>
              </span>
              <span className={styles.proofMedia}>
                <Image
                  src={proof.poster}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 768px) 736px, 100vw"
                  className={styles.proofPoster}
                />
                {proof.video && <ProofVideo src={proof.video} />}
              </span>
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
