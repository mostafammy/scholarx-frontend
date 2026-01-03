/**
 * StarRating Component
 * Reusable star rating display component
 * Following Single Responsibility and Open/Closed Principles
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { RATING_CONFIG } from "../constants";
import styles from "./StarRating.module.css";

/**
 * Renders a single star based on fill type
 */
const Star = memo(({ type, size, className }) => {
  const starProps = {
    className: `${styles.star} ${className}`,
    size,
    "aria-hidden": true,
  };

  switch (type) {
    case "full":
      return <FaStar {...starProps} />;
    case "half":
      return <FaStarHalfAlt {...starProps} />;
    default:
      return <FaRegStar {...starProps} />;
  }
});

Star.displayName = "Star";

Star.propTypes = {
  type: PropTypes.oneOf(["full", "half", "empty"]).isRequired,
  size: PropTypes.number,
  className: PropTypes.string,
};

Star.defaultProps = {
  size: RATING_CONFIG.STAR_SIZE.default,
  className: "",
};

/**
 * Determines star type based on rating value and position
 */
const getStarType = (position, rating) => {
  if (position <= rating) return "full";
  if (position - rating < 1 && position - rating > 0) return "half";
  return "empty";
};

/**
 * StarRating Component
 * Displays a visual star rating with optional count label
 */
const StarRating = ({
  rating,
  maxStars,
  totalRatings,
  size,
  showCount,
  className,
  starClassName,
  countClassName,
}) => {
  const normalizedRating = Math.min(Math.max(0, rating), maxStars);
  const stars = Array.from({ length: maxStars }, (_, index) => ({
    id: index + 1,
    type: getStarType(index + 1, normalizedRating),
  }));

  const ratingLabel = totalRatings ? `(${totalRatings})` : null;
  const ariaLabel = `Rating: ${normalizedRating} out of ${maxStars} stars${
    totalRatings ? `, based on ${totalRatings} reviews` : ""
  }`;

  return (
    <div
      className={`${styles.ratingContainer} ${className}`}
      role="img"
      aria-label={ariaLabel}
    >
      <div className={styles.starsWrapper}>
        {stars.map(({ id, type }) => (
          <Star key={id} type={type} size={size} className={starClassName} />
        ))}
      </div>
      {showCount && ratingLabel && (
        <span className={`${styles.ratingCount} ${countClassName}`}>
          {ratingLabel}
        </span>
      )}
    </div>
  );
};

StarRating.propTypes = {
  /** Rating value (0 to maxStars) */
  rating: PropTypes.number,
  /** Maximum number of stars */
  maxStars: PropTypes.number,
  /** Total number of ratings/reviews */
  totalRatings: PropTypes.number,
  /** Size of star icons in pixels */
  size: PropTypes.number,
  /** Whether to show the ratings count */
  showCount: PropTypes.bool,
  /** Additional className for container */
  className: PropTypes.string,
  /** Additional className for stars */
  starClassName: PropTypes.string,
  /** Additional className for count */
  countClassName: PropTypes.string,
};

StarRating.defaultProps = {
  rating: 0,
  maxStars: RATING_CONFIG.MAX_STARS,
  totalRatings: null,
  size: RATING_CONFIG.STAR_SIZE.default,
  showCount: true,
  className: "",
  starClassName: "",
  countClassName: "",
};

export default memo(StarRating);
