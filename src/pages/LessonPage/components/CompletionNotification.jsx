/**
 * CompletionNotification Component
 * Toast notification for lesson completion
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import styles from "./CompletionNotification.module.css";

const CompletionNotification = memo(function CompletionNotification({
  isVisible,
  completedCount,
  totalLessons,
  isCourseComplete,
  onDismiss,
}) {
  if (!isVisible) return null;

  return (
    <div className={styles.notification}>
      <div className={styles.iconWrapper}>
        <span className={styles.icon}>✅</span>
        <div className={styles.ripple}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.title}>Lesson Completed!</div>
        <div className={styles.message}>
          {completedCount}/{totalLessons} lessons completed
        </div>
        {isCourseComplete && (
          <div className={styles.courseComplete}>
            <span className={styles.celebrationIcon}>🎉</span>
            Course Complete! Check your certificate!
          </div>
        )}
      </div>

      <button
        className={styles.closeBtn}
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        ✕
      </button>

      {/* Progress indicator */}
      <div className={styles.progressLine}></div>
    </div>
  );
});

CompletionNotification.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  completedCount: PropTypes.number.isRequired,
  totalLessons: PropTypes.number.isRequired,
  isCourseComplete: PropTypes.bool,
  onDismiss: PropTypes.func.isRequired,
};

export default CompletionNotification;
