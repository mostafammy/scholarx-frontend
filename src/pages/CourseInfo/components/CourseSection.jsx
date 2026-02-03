/**
 * CourseSection Component
 * Premium section container with card design and gradient icon wrapper
 * Following Open/Closed Principle - extensible through props
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import styles from "./CourseSection.module.css";

const CourseSection = ({
  iconSrc,
  iconAlt,
  title,
  children,
  className,
  variant,
}) => (
  <section
    className={`${styles.section} ${styles[variant] || ""} ${className}`}
  >
    <div className={styles.card}>
      <header className={styles.header}>
        {iconSrc && (
          <div className={styles.iconWrapper}>
            <img
              src={iconSrc}
              alt={iconAlt}
              className={styles.icon}
              loading="lazy"
            />
          </div>
        )}
        <h2 className={styles.title}>{title}</h2>
      </header>
      <div className={styles.content}>{children}</div>
    </div>
  </section>
);

CourseSection.propTypes = {
  /** Section icon source */
  iconSrc: PropTypes.string,
  /** Section icon alt text */
  iconAlt: PropTypes.string,
  /** Section title */
  title: PropTypes.string.isRequired,
  /** Section content */
  children: PropTypes.node.isRequired,
  /** Additional CSS class */
  className: PropTypes.string,
  /** Section variant for styling */
  variant: PropTypes.oneOf(["default", "description", "learning", "audience"]),
};

CourseSection.defaultProps = {
  iconSrc: null,
  iconAlt: "",
  className: "",
  variant: "default",
};

export default memo(CourseSection);
