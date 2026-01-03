/**
 * CourseDescription Component
 * Displays course description text
 * Following Single Responsibility Principle
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import styles from "./CourseDescription.module.css";

const CourseDescription = ({ description }) => {
  if (!description) return null;

  return <p className={styles.description}>{description}</p>;
};

CourseDescription.propTypes = {
  /** Course description text */
  description: PropTypes.string,
};

CourseDescription.defaultProps = {
  description: "",
};

export default memo(CourseDescription);
