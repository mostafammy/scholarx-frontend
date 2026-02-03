/**
 * CourseDescription Component
 * Displays course description text with Markdown support
 *
 * Security: Uses MarkdownRenderer with whitelist approach
 * Performance: Memoized to prevent unnecessary re-renders
 * SOLID: SRP - Single responsibility for displaying descriptions
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import MarkdownRenderer from "../../../components/common/MarkdownRenderer";
import styles from "./CourseDescription.module.css";

const CourseDescription = ({ description }) => {
  if (!description) return null;

  return (
    <MarkdownRenderer content={description} className={styles.description} />
  );
};

CourseDescription.propTypes = {
  /** Course description text (supports Markdown) */
  description: PropTypes.string,
};

CourseDescription.defaultProps = {
  description: "",
};

export default memo(CourseDescription);
