/**
 * SearchResults Component
 * Displays search results with pagination
 * Following Single Responsibility Principle
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import CourseGrid from "./CourseGrid";
import Pagination from "./Pagination";
import styles from "./SearchResults.module.css";

const SearchResults = ({
  searchTerm,
  courses,
  pagination,
  page,
  isLoading,
  onNextPage,
  onPrevPage,
  className,
}) => {
  const hasResults = courses && courses.length > 0;

  return (
    <section className={`${styles.section} ${className}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Search Results for:{" "}
          <span className={styles.searchTerm}>"{searchTerm}"</span>
        </h2>
        {hasResults && !isLoading && (
          <span className={styles.count}>
            {pagination.total || courses.length} courses found
          </span>
        )}
      </div>

      {isLoading ? (
        <CourseGrid isLoading skeletonCount={6} section="search" />
      ) : hasResults ? (
        <>
          <CourseGrid courses={courses} section="search" />
          <Pagination
            hasNextPage={pagination.hasNextPage}
            hasPrevPage={pagination.hasPreviousPage}
            currentPage={page}
            totalPages={pagination.totalPages}
            onNextPage={onNextPage}
            onPrevPage={onPrevPage}
          />
        </>
      ) : (
        <div className={styles.noResults}>
          <div className={styles.noResultsIcon}>🔍</div>
          <h3 className={styles.noResultsTitle}>No courses found</h3>
          <p className={styles.noResultsText}>
            We couldn't find any courses matching "{searchTerm}". Try a
            different search term.
          </p>
        </div>
      )}
    </section>
  );
};

SearchResults.propTypes = {
  /** Current search term */
  searchTerm: PropTypes.string.isRequired,
  /** Array of search result courses */
  courses: PropTypes.array,
  /** Pagination data */
  pagination: PropTypes.shape({
    hasNextPage: PropTypes.bool,
    hasPreviousPage: PropTypes.bool,
    totalPages: PropTypes.number,
    total: PropTypes.number,
  }),
  /** Current page number */
  page: PropTypes.number,
  /** Loading state */
  isLoading: PropTypes.bool,
  /** Next page handler */
  onNextPage: PropTypes.func.isRequired,
  /** Previous page handler */
  onPrevPage: PropTypes.func.isRequired,
  /** Additional CSS class */
  className: PropTypes.string,
};

SearchResults.defaultProps = {
  courses: [],
  pagination: {},
  page: 1,
  isLoading: false,
  className: "",
};

export default memo(SearchResults);
