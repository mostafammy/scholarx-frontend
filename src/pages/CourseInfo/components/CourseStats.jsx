/**
 * CourseStats Component
 * Displays course statistics (videos, quizzes, PDFs)
 * Following Single Responsibility Principle
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import StatCard from "./StatCard";
import styles from "./CourseStats.module.css";

const CourseStats = ({ stats, className }) => (
  <div className={`${styles.statsContainer} ${className}`}>
    {stats.map((stat) => (
      <StatCard
        key={stat.id}
        iconSrc={stat.iconSrc}
        iconAlt={stat.iconAlt}
        count={stat.count}
        label={stat.label}
      />
    ))}
  </div>
);

CourseStats.propTypes = {
  /** Array of stat objects to display */
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      iconSrc: PropTypes.string.isRequired,
      iconAlt: PropTypes.string.isRequired,
      count: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  /** Additional CSS class */
  className: PropTypes.string,
};

CourseStats.defaultProps = {
  className: "",
};

export default memo(CourseStats);
