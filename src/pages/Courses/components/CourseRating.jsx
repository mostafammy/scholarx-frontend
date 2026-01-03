/**
 * CourseRating Component
 * Displays star rating with review count
 * Following Single Responsibility Principle
 */

import React, { memo, useMemo } from "react";
import PropTypes from "prop-types";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import styles from "./CourseRating.module.css";

const CourseRating = ({ rating, reviewCount, size, showCount, className }) => {
  const stars = useMemo(() => {
    const result = [];
    const normalizedRating = Math.min(Math.max(0, rating), 5);

    for (let i = 1; i <= 5; i++) {
      let StarComponent;
      if (i <= normalizedRating) {
        StarComponent = FaStar;
      } else if (i - normalizedRating < 1 && i - normalizedRating > 0) {
        StarComponent = FaStarHalfAlt;
      } else {
        StarComponent = FaRegStar;
      }

      result.push(
        <StarComponent
          key={i}
          className={`${styles.star} ${
            i <= normalizedRating ? styles.starFilled : styles.starEmpty
          }`}
          style={{ fontSize: size }}
        />
      );
    }
    return result;
  }, [rating, size]);

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.stars}>{stars}</div>
      {showCount && reviewCount !== undefined && (
        <span className={styles.count}>
          {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
        </span>
      )}
    </div>
  );
};

CourseRating.propTypes = {
  /** Rating value (0-5) */
  rating: PropTypes.number,
  /** Number of reviews */
  reviewCount: PropTypes.number,
  /** Star size in pixels */
  size: PropTypes.number,
  /** Whether to show review count */
  showCount: PropTypes.bool,
  /** Additional CSS class */
  className: PropTypes.string,
};

CourseRating.defaultProps = {
  rating: 0,
  reviewCount: 0,
  size: 14,
  showCount: true,
  className: "",
};

export default memo(CourseRating);
