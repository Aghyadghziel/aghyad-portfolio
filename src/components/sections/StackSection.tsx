import { Icon } from "@once-ui-system/core";
import { capabilities } from "@/resources";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "./Section";
import styles from "./StackSection.module.scss";

/**
 * Technologies, grouped by what they do.
 *
 * Three small groups rather than a wall of logos, so the list stays scannable
 * and it is obvious where the depth is.
 */
export function StackSection() {
  if (!capabilities.display) return null;

  return (
    <Section
      id={capabilities.id}
      eyebrow={capabilities.eyebrow}
      title={capabilities.title}
      description={capabilities.description}
      divider
    >
      <div className={styles.groups}>
        {capabilities.groups.map((group, index) => (
          <Reveal
            variant="up"
            delay={Math.min(index * 0.06, 0.18)}
            className={styles.group}
            key={group.title}
          >
            <h3 className={styles.groupTitle}>{group.title}</h3>
            <p className={styles.groupDescription}>{group.description}</p>
            <ul className={styles.tags}>
              {group.tags.map((tag) => (
                <li className={styles.tag} key={tag.name}>
                  {tag.icon && <Icon name={tag.icon} size="s" className={styles.tagIcon} />}
                  <span>{tag.name}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
