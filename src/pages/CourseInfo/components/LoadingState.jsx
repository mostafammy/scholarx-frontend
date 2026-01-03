/**
 * LoadingState Component
 * Displays loading skeleton or spinner
 * Following Single Responsibility Principle
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import styles from "./LoadingState.module.css";

const LoadingState = ({ message }) => (
  <div className={styles.container} role="status" aria-live="polite">
    <div className={styles.spinner} aria-hidden="true" />
    <p className={styles.message}>{message}</p>
  </div>
);

LoadingState.propTypes = {
  /** Loading message to display */
  message: PropTypes.string,
};

LoadingState.defaultProps = {
  message: "Loading course details...",
};

export default memo(LoadingState);
