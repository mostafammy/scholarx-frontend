/**
 * ErrorState Component
 * Displays error message with retry option
 * Following Single Responsibility Principle
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import styles from "./ErrorState.module.css";

const ErrorState = ({ message, onRetry }) => (
  <div className={styles.container} role="alert">
    <div className={styles.iconWrapper}>
      <span className={styles.icon}>⚠️</span>
    </div>
    <p className={styles.message}>{message}</p>
    {onRetry && (
      <button type="button" className={styles.retryButton} onClick={onRetry}>
        Try Again
      </button>
    )}
  </div>
);

ErrorState.propTypes = {
  /** Error message to display */
  message: PropTypes.string,
  /** Callback function for retry action */
  onRetry: PropTypes.func,
};

ErrorState.defaultProps = {
  message: "Something went wrong. Please try again.",
  onRetry: null,
};

export default memo(ErrorState);
