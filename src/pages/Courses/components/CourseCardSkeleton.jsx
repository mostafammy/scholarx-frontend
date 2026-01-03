/**
 * CourseCardSkeleton Component
 * Loading skeleton with shimmer animation
 * Following Single Responsibility Principle
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import styles from "./CourseCardSkeleton.module.css";

const CourseCardSkeleton = ({ className }) => (
  <div className={`${styles.card} ${className}`} aria-hidden="true">
    <div className={styles.imageWrapper}>
      <div className={styles.image} />
    </div>
    <div className={styles.body}>
      <div className={styles.metaRow}>
        <div className={styles.badge} />
        <div className={styles.badge} />
      </div>
      <div className={styles.title} />
      <div className={styles.titleShort} />
      <div className={styles.actionRow}>
        <div className={styles.button} />
        <div className={styles.price} />
      </div>
      <div className={styles.rating} />
      <div className={styles.footer}>
        <div className={styles.instructor} />
        <div className={styles.details} />
      </div>
    </div>
  </div>
);

CourseCardSkeleton.propTypes = {
  className: PropTypes.string,
};

CourseCardSkeleton.defaultProps = {
  className: "",
};

export default memo(CourseCardSkeleton);
