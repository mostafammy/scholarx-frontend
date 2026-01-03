/**
 * ProgressBar Component
 * Animated progress bar with completion states
 */

import React, { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "./ProgressBar.module.css";

const ProgressBar = memo(function ProgressBar({
  progress,
  completedCount,
  totalLessons,
  isCompleted,
}) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Animate progress bar on mount/change
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.label}>
          <span className={styles.labelIcon}>📚</span>
          Course Progress
        </span>
        <span className={styles.count}>
          <span className={styles.completed}>{completedCount}</span>
          <span className={styles.separator}>/</span>
          <span className={styles.total}>{totalLessons}</span>
          <span className={styles.lessonsText}>lessons</span>
        </span>
      </div>

      <div className={styles.barContainer}>
        <div
          className={`${styles.barFill} ${isCompleted ? styles.completed : ""}`}
          style={{ width: `${animatedProgress}%` }}
        >
          {animatedProgress > 10 && <div className={styles.shimmer}></div>}
        </div>
        {/* Progress milestones */}
        <div className={styles.milestones}>
          <div
            className={`${styles.milestone} ${
              progress >= 25 ? styles.reached : ""
            }`}
            style={{ left: "25%" }}
          />
          <div
            className={`${styles.milestone} ${
              progress >= 50 ? styles.reached : ""
            }`}
            style={{ left: "50%" }}
          />
          <div
            className={`${styles.milestone} ${
              progress >= 75 ? styles.reached : ""
            }`}
            style={{ left: "75%" }}
          />
        </div>
      </div>

      <div className={styles.footer}>
        <span
          className={`${styles.percentage} ${
            isCompleted ? styles.completedText : ""
          }`}
        >
          {Math.round(progress)}% Complete
        </span>
        {isCompleted && (
          <span className={styles.completedBadge}>
            <span className={styles.badgeIcon}>🎉</span>
            Course Finished!
          </span>
        )}
      </div>
    </div>
  );
});

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  completedCount: PropTypes.number.isRequired,
  totalLessons: PropTypes.number.isRequired,
  isCompleted: PropTypes.bool,
};

export default ProgressBar;
