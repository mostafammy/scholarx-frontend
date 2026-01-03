/**
 * ImpactSection Component
 * Displays the organization's impact metrics and achievements
 */

import React from "react";
import PropTypes from "prop-types";
import { ImpactCard } from "../shared";
import { ANIMATION_TIMINGS } from "../../constants";
import styles from "./ImpactSection.module.css";

const ImpactSection = ({ title, items }) => {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.underline}></div>

      <div className={styles.grid}>
        {items.slice(0, 3).map((item, index) => (
          <ImpactCard
            key={item.id}
            icon={item.icon}
            alt={item.alt}
            title={item.title}
            description={item.description}
            delay={index * ANIMATION_TIMINGS.stagger}
          />
        ))}
      </div>

      <div className={styles.gridCenter}>
        {items.slice(3).map((item, index) => (
          <ImpactCard
            key={item.id}
            icon={item.icon}
            alt={item.alt}
            title={item.title}
            description={item.description}
            delay={(index + 3) * ANIMATION_TIMINGS.stagger}
          />
        ))}
      </div>
    </section>
  );
};

ImpactSection.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default React.memo(ImpactSection);
