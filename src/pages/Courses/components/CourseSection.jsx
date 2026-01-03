/**
 * CourseSection Component
 * Section container with title and courses grid
 * Following Single Responsibility Principle
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import CourseGrid from "./CourseGrid";
import Pagination from "./Pagination";
import styles from "./CourseSection.module.css";

const CourseSection = ({
  title,
  highlightedWord,
  courses,
  section,
  isLoading,
  pagination,
  onNextPage,
  onPrevPage,
  currentPage,
  className,
}) => {
  // Don't render if no courses and not loading
  if (!isLoading && (!courses || courses.length === 0)) {
    return null;
  }

  return (
    <section className={`${styles.section} ${className}`}>
      <h2 className={styles.title}>
        {highlightedWord && (
          <span className={styles.highlight}>{highlightedWord}</span>
        )}{" "}
        {title}
      </h2>

      <CourseGrid
        courses={courses}
        section={section}
        isLoading={isLoading}
        skeletonCount={6}
      />

      <Pagination
        hasNextPage={pagination?.hasNextPage}
        hasPrevPage={pagination?.hasPreviousPage}
        currentPage={currentPage}
        totalPages={pagination?.totalPages}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
      />
    </section>
  );
};

CourseSection.propTypes = {
  /** Section title */
  title: PropTypes.string.isRequired,
  /** Word to highlight in title */
  highlightedWord: PropTypes.string,
  /** Array of courses */
  courses: PropTypes.array,
  /** Section type */
  section: PropTypes.string,
  /** Loading state */
  isLoading: PropTypes.bool,
  /** Pagination data */
  pagination: PropTypes.shape({
    hasNextPage: PropTypes.bool,
    hasPreviousPage: PropTypes.bool,
    totalPages: PropTypes.number,
  }),
  /** Next page handler */
  onNextPage: PropTypes.func,
  /** Previous page handler */
  onPrevPage: PropTypes.func,
  /** Current page number */
  currentPage: PropTypes.number,
  /** Additional CSS class */
  className: PropTypes.string,
};

CourseSection.defaultProps = {
  highlightedWord: null,
  courses: [],
  section: "latest",
  isLoading: false,
  pagination: {},
  onNextPage: () => {},
  onPrevPage: () => {},
  currentPage: 1,
  className: "",
};

export default memo(CourseSection);
