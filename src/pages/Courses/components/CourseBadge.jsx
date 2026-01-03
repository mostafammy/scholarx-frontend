/**
 * CourseBadge Component
 * Displays course badges (New, Featured, Category)
 * Following Single Responsibility Principle
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import styles from "./CourseBadge.module.css";

const BADGE_VARIANTS = {
  new: styles.badgeNew,
  featured: styles.badgeFeatured,
  scholarx: styles.badgeScholarx,
  category: styles.badgeCategory,
  paid: styles.badgePaid,
};

const CourseBadge = ({ label, variant, className }) => {
  if (!label) return null;

  const variantClass = BADGE_VARIANTS[variant] || BADGE_VARIANTS.category;

  return (
    <span className={`${styles.badge} ${variantClass} ${className}`}>
      {label}
    </span>
  );
};

CourseBadge.propTypes = {
  /** Badge label text */
  label: PropTypes.string,
  /** Badge variant for styling */
  variant: PropTypes.oneOf(["new", "featured", "scholarx", "category", "paid"]),
  /** Additional CSS class */
  className: PropTypes.string,
};

CourseBadge.defaultProps = {
  label: null,
  variant: "category",
  className: "",
};

export default memo(CourseBadge);
