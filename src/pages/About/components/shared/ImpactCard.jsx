/**
 * ImpactCard Component
 * Displays individual impact statistics with icon and description
 */

import React from "react";
import PropTypes from "prop-types";
import styles from "./ImpactCard.module.css";

const ImpactCard = ({ icon, alt, title, description, delay = 0 }) => {
  return (
    <div className={styles.card} style={{ "--animation-delay": `${delay}ms` }}>
      <div className={styles.iconWrapper}>
        <img src={icon} alt={alt} className={styles.icon} loading="lazy" />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

ImpactCard.propTypes = {
  icon: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  delay: PropTypes.number,
};

export default React.memo(ImpactCard);
