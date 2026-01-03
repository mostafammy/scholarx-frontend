/**
 * CourseGrid Component
 * Responsive grid layout for course cards
 * Following Single Responsibility Principle
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import CourseCard from "./CourseCard";
import CourseCardSkeleton from "./CourseCardSkeleton";
import styles from "./CourseGrid.module.css";

const CourseGrid = ({
  courses,
  section,
  isLoading,
  skeletonCount,
  className,
}) => {
  if (isLoading) {
    return (
      <div className={`${styles.grid} ${className}`}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div key={`skeleton-${index}`} className={styles.gridItem}>
            <CourseCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.grid} ${className}`}>
      {courses.map((course, index) => (
        <div key={course._id} className={styles.gridItem}>
          <CourseCard course={course} section={section} index={index} />
        </div>
      ))}
    </div>
  );
};

CourseGrid.propTypes = {
  /** Array of course objects */
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
    })
  ),
  /** Section type for styling */
  section: PropTypes.string,
  /** Loading state */
  isLoading: PropTypes.bool,
  /** Number of skeleton cards to show */
  skeletonCount: PropTypes.number,
  /** Additional CSS class */
  className: PropTypes.string,
};

CourseGrid.defaultProps = {
  courses: [],
  section: "latest",
  isLoading: false,
  skeletonCount: 6,
  className: "",
};

export default memo(CourseGrid);
