/**
 * Pagination Component
 * Reusable pagination with micro-animations
 * Following Single Responsibility Principle
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from "./Pagination.module.css";

const Pagination = ({
  hasNextPage,
  hasPrevPage,
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
  showPageInfo,
  className,
}) => {
  // Don't render if only one page
  if (!hasNextPage && !hasPrevPage) {
    return null;
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <button
        type="button"
        className={`${styles.button} ${styles.buttonPrev}`}
        onClick={onPrevPage}
        disabled={!hasPrevPage}
        aria-label="Previous page"
      >
        <FaChevronLeft className={styles.icon} />
        <span className={styles.buttonText}>Previous</span>
      </button>

      {showPageInfo && totalPages > 0 && (
        <span className={styles.pageInfo}>
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>
      )}

      <button
        type="button"
        className={`${styles.button} ${styles.buttonNext}`}
        onClick={onNextPage}
        disabled={!hasNextPage}
        aria-label="Next page"
      >
        <span className={styles.buttonText}>Next</span>
        <FaChevronRight className={styles.icon} />
      </button>
    </div>
  );
};

Pagination.propTypes = {
  /** Whether there's a next page */
  hasNextPage: PropTypes.bool,
  /** Whether there's a previous page */
  hasPrevPage: PropTypes.bool,
  /** Current page number */
  currentPage: PropTypes.number,
  /** Total number of pages */
  totalPages: PropTypes.number,
  /** Next page handler */
  onNextPage: PropTypes.func.isRequired,
  /** Previous page handler */
  onPrevPage: PropTypes.func.isRequired,
  /** Whether to show page info */
  showPageInfo: PropTypes.bool,
  /** Additional CSS class */
  className: PropTypes.string,
};

Pagination.defaultProps = {
  hasNextPage: false,
  hasPrevPage: false,
  currentPage: 1,
  totalPages: 1,
  showPageInfo: true,
  className: "",
};

export default memo(Pagination);
