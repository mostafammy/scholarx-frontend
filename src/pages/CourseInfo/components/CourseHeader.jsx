/**
 * CourseHeader Component
 * Hero section with course title, tagline, rating, and CTA
 * Following Single Responsibility Principle
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import StarRating from "./StarRating";
import CourseStats from "./CourseStats";
import EnrollmentButton from "../../../components/EnrollmentButton/EnrollmentButton";
import styles from "./CourseHeader.module.css";

const CourseHeader = ({
  headerImage,
  title,
  tagline,
  rating,
  totalRatings,
  stats,
  courseId,
  course,
  isSubscribed,
}) => {
  const courseWithAccess = isSubscribed
    ? { ...course, isSubscribed: true }
    : course;

  return (
    <header
      className={styles.header}
      style={{
        backgroundImage: `url("${headerImage}")`,
      }}
    >
      <img
        src="/Grouplogo.png"
        alt=""
        className={styles.overlayImage}
        aria-hidden="true"
      />

      <div className={styles.overlayContent}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.tagline}>{tagline}</p>

        <StarRating
          rating={rating}
          totalRatings={totalRatings}
          className={styles.rating}
          countClassName={styles.ratingCount}
        />

        <EnrollmentButton
          course={courseWithAccess}
          courseId={courseId}
          courseTitle={title}
          openLabel="Open Course"
          openClassName={styles.enrollButton}
          enrollClassName={styles.enrollButton}
          useDefaultStyles={false}
          hookOptions={{
            isEnrolledOverride: isSubscribed,
          }}
        />
      </div>

      <CourseStats stats={stats} />
    </header>
  );
};

CourseHeader.propTypes = {
  /** Background header image URL */
  headerImage: PropTypes.string.isRequired,
  /** Course title */
  title: PropTypes.string.isRequired,
  /** Course tagline/subtitle */
  tagline: PropTypes.string,
  /** Course rating (0-5) */
  rating: PropTypes.number,
  /** Total number of ratings */
  totalRatings: PropTypes.number,
  /** Array of stat objects */
  stats: PropTypes.array.isRequired,
  /** Course ID for enrollment */
  courseId: PropTypes.string,
  /** Full course object */
  course: PropTypes.object,
  /** Whether user is subscribed */
  isSubscribed: PropTypes.bool,
};

CourseHeader.defaultProps = {
  tagline: "",
  rating: 0,
  totalRatings: 0,
  courseId: null,
  course: null,
  isSubscribed: false,
};

export default memo(CourseHeader);
