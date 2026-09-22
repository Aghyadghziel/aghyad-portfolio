import { Icon } from "@once-ui-system/core";
import { contact } from "@/resources";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { CTA } from "@/components/ui/CTA";
import styles from "./ContactSection.module.scss";

/**
 * Closing contact block.
 *
 * Deliberately plain: a heading, one sentence, two actions and the three
 * channels listed with their actual addresses, so nobody has to hunt for a
 * way to get in touch.
 */
export function ContactSection() {
  if (!contact.display) return null;

  return (
    <section id={contact.id} className={styles.contact} aria-labelledby="contact-heading">
      <div className={styles.container}>
        <Reveal variant="fade" className={styles.eyebrow}>
          <span className={styles.dot} aria-hidden="true" />
          {contact.eyebrow}
        </Reveal>

        {typeof contact.title === "string" ? (
          <TextReveal as="h2" id="contact-heading" lines={[contact.title]} className={styles.headline} />
        ) : (
          <Reveal variant="up">
            <h2 id="contact-heading" className={styles.headline}>
              {contact.title}
            </h2>
          </Reveal>
        )}

        <Reveal variant="up" delay={0.06}>
          <p className={styles.description}>{contact.description}</p>
        </Reveal>

        <Reveal variant="up" delay={0.12} className={styles.actions}>
          <CTA href={contact.primary.href} variant="primary" arrow external={contact.primary.external}>
            {contact.primary.label}
          </CTA>
          <CTA
            href={contact.secondary.href}
            variant="secondary"
            external={contact.secondary.external}
          >
            {contact.secondary.label}
          </CTA>
        </Reveal>

        <Reveal variant="up" delay={0.18}>
          <ul className={styles.channels}>
            {contact.channels.map((channel) => (
              <li className={styles.channelItem} key={channel.name}>
                <a
                  href={channel.href}
                  className={styles.channel}
                  {...(channel.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : undefined)}
                >
                  <span className={styles.channelIcon}>
                    <Icon name={channel.icon} size="s" />
                  </span>
                  <span className={styles.channelBody}>
                    <span className={styles.channelName}>{channel.name}</span>
                    <span className={styles.channelValue}>{channel.value}</span>
                  </span>
                  <Icon name="arrowLongRight" size="s" className={styles.channelArrow} />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
