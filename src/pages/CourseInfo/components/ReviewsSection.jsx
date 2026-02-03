/**
 * ReviewsSection Component
 * Course reviews with rating distribution and review cards
 *
 * Architecture:
 * - Single Responsibility: Reviews display only
 * - Backward compatible - gracefully handles missing reviews
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import styles from "./ReviewsSection.module.css";

/**
 * RatingBar - Individual rating bar in distribution
 */
const RatingBar = ({ stars, count, total, index }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div
      className={styles.ratingBar}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <span className={styles.ratingStars}>{stars} ⭐</span>
      <div className={styles.barWrapper}>
        <div className={styles.barFill} style={{ width: `${percentage}%` }} />
      </div>
      <span className={styles.ratingCount}>{count}</span>
    </div>
  );
};

/**
 * ReviewCard - Individual review display
 */
const ReviewCard = ({ review, index }) => {
  const { name, image, rating, text, date } = review;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < rating ? styles.starFilled : styles.starEmpty}
      >
        ★
      </span>
    ));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className={styles.reviewCard}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={styles.reviewHeader}>
        <div className={styles.reviewerInfo}>
          <img
            src={image || "/default-avatar.png"}
            alt={name}
            className={styles.reviewerAvatar}
            loading="lazy"
          />
          <div className={styles.reviewerDetails}>
            <span className={styles.reviewerName}>{name}</span>
            {date && (
              <span className={styles.reviewDate}>{formatDate(date)}</span>
            )}
          </div>
        </div>
        <div className={styles.reviewRating}>{renderStars(rating)}</div>
      </div>
      <p className={styles.reviewText}>{text}</p>
    </div>
  );
};

/**
 * ReviewsSection - Main component
 */
const ReviewsSection = ({
  reviews = [],
  averageRating = 0,
  totalReviews = 0,
  ratingDistribution = {},
}) => {
  // Graceful fallback when no reviews
  if (!reviews || reviews.length === 0) {
    return null;
  }

  const displayRating =
    averageRating ||
    (
      reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length
    ).toFixed(1);

  const displayTotal = totalReviews || reviews.length;

  // Calculate distribution if not provided
  const distribution =
    Object.keys(ratingDistribution).length > 0
      ? ratingDistribution
      : reviews.reduce((acc, r) => {
          const star = r.rating || 5;
          acc[star] = (acc[star] || 0) + 1;
          return acc;
        }, {});

  return (
    <section className={styles.reviews}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Student Reviews</h2>
        </div>

        <div className={styles.reviewsContent}>
          {/* Rating Summary */}
          <div className={styles.ratingSummary}>
            <div className={styles.averageRating}>
              <span className={styles.ratingNumber}>{displayRating}</span>
              <div className={styles.ratingStarsLarge}>
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={
                      i < Math.round(displayRating)
                        ? styles.starFilled
                        : styles.starEmpty
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className={styles.totalReviews}>
                Based on {displayTotal}{" "}
                {displayTotal === 1 ? "review" : "reviews"}
              </span>
            </div>

            {/* Rating Distribution */}
            <div className={styles.ratingDistribution}>
              {[5, 4, 3, 2, 1].map((stars, index) => (
                <RatingBar
                  key={stars}
                  stars={stars}
                  count={distribution[stars] || 0}
                  total={displayTotal}
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Review Cards */}
          <div className={styles.reviewsList}>
            {reviews.slice(0, 6).map((review, index) => (
              <ReviewCard
                key={review.id || index}
                review={review}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

ReviewsSection.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string.isRequired,
      image: PropTypes.string,
      rating: PropTypes.number,
      text: PropTypes.string,
      date: PropTypes.string,
    }),
  ),
  averageRating: PropTypes.number,
  totalReviews: PropTypes.number,
  ratingDistribution: PropTypes.object,
};

export default memo(ReviewsSection);
