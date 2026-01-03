/**
 * StatCard Component
 * Displays a single statistic with icon
 * Following Single Responsibility Principle
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import styles from "./StatCard.module.css";

const StatCard = ({ iconSrc, iconAlt, count, label, className }) => (
  <div className={`${styles.statItem} ${className}`}>
    <img
      src={iconSrc}
      alt={iconAlt}
      className={styles.statIcon}
      loading="lazy"
    />
    <div className={styles.statInfo}>
      <span className={styles.statNumber}>{count}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  </div>
);

StatCard.propTypes = {
  /** Icon image source */
  iconSrc: PropTypes.string.isRequired,
  /** Icon alt text for accessibility */
  iconAlt: PropTypes.string.isRequired,
  /** Numeric count to display */
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /** Label text below the count */
  label: PropTypes.string.isRequired,
  /** Additional CSS class */
  className: PropTypes.string,
};

StatCard.defaultProps = {
  className: "",
};

export default memo(StatCard);
