/**
 * CourseMetaBadge Component
 * Displays course metadata (duration, lectures, price type)
 * Following Single Responsibility Principle
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import { FaClock, FaPlayCircle, FaMoneyBill } from "react-icons/fa";
import styles from "./CourseMetaBadge.module.css";

const ICONS = {
  duration: FaClock,
  lectures: FaPlayCircle,
  paid: FaMoneyBill,
};

const VARIANTS = {
  duration: styles.variantDuration,
  lectures: styles.variantLectures,
  paid: styles.variantPaid,
};

const CourseMetaBadge = ({ type, value, label, className }) => {
  const Icon = ICONS[type];
  const variantClass = VARIANTS[type] || "";

  return (
    <span className={`${styles.metaBadge} ${variantClass} ${className}`}>
      {Icon && <Icon className={styles.icon} />}
      <span className={styles.value}>{value}</span>
      {label && <span className={styles.label}>{label}</span>}
    </span>
  );
};

CourseMetaBadge.propTypes = {
  /** Type of metadata */
  type: PropTypes.oneOf(["duration", "lectures", "paid"]).isRequired,
  /** Value to display */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  /** Optional label suffix */
  label: PropTypes.string,
  /** Additional CSS class */
  className: PropTypes.string,
};

CourseMetaBadge.defaultProps = {
  label: null,
  className: "",
};

export default memo(CourseMetaBadge);
