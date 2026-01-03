/**
 * SearchHero Component
 * Hero section with search functionality
 * Following Single Responsibility Principle
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import { CiSearch } from "react-icons/ci";
import styles from "./SearchHero.module.css";

const SearchHero = ({
  title,
  subtitle,
  description,
  searchTerm,
  onSearchChange,
  placeholder,
  className,
}) => {
  const handleInputChange = (e) => {
    onSearchChange(e.target.value);
  };

  return (
    <section className={`${styles.hero} ${className}`}>
      <div className={styles.backgroundOverlay} />

      <div className={styles.content}>
        <span className={styles.subtitle}>{subtitle}</span>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>

        <form
          className={styles.searchForm}
          onSubmit={(e) => e.preventDefault()}
        >
          <div className={styles.inputWrapper}>
            <CiSearch className={styles.searchIcon} />
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder={placeholder}
              className={styles.searchInput}
              aria-label="Search courses"
            />
            {searchTerm && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

SearchHero.propTypes = {
  /** Main title */
  title: PropTypes.string,
  /** Subtitle above title */
  subtitle: PropTypes.string,
  /** Description text */
  description: PropTypes.string,
  /** Current search term */
  searchTerm: PropTypes.string,
  /** Search change handler */
  onSearchChange: PropTypes.func.isRequired,
  /** Search input placeholder */
  placeholder: PropTypes.string,
  /** Additional CSS class */
  className: PropTypes.string,
};

SearchHero.defaultProps = {
  title: "Discover Our Courses",
  subtitle: "Courses",
  description: "Scholarships, Mentorship & Skill Development Opportunities",
  searchTerm: "",
  placeholder: "Search by course title",
  className: "",
};

export default memo(SearchHero);
