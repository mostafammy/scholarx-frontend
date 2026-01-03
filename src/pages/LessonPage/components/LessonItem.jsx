/**
 * LessonItem Component
 * Individual lesson item with completion state and animations
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import styles from "./LessonItem.module.css";

const LessonItem = memo(function LessonItem({
  lesson,
  isActive,
  isCompleted,
  onClick,
  index,
}) {
  const formatDuration = (duration) => {
    if (!duration) return "00:00";
    const minutes = Math.floor(duration);
    const seconds = Math.round((duration - minutes) * 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      className={`${styles.item} ${isActive ? styles.active : ""} ${
        isCompleted ? styles.completed : ""
      }`}
      onClick={onClick}
      style={{ "--animation-delay": `${index * 0.05}s` }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <div className={styles.statusIcon}>
        {isCompleted ? (
          <span className={styles.checkmark}>✓</span>
        ) : isActive ? (
          <span className={styles.playingIndicator}>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </span>
        ) : (
          <span className={styles.lessonNumber}>{index + 1}</span>
        )}
      </div>

      <div className={styles.content}>
        <span className={styles.title}>{lesson.title}</span>
        {lesson.description && (
          <span className={styles.description}>{lesson.description}</span>
        )}
      </div>

      <div className={styles.meta}>
        <span className={styles.duration}>
          <span className={styles.clockIcon}>⏱</span>
          {formatDuration(lesson.duration)}
        </span>
      </div>
    </div>
  );
});

LessonItem.propTypes = {
  lesson: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    duration: PropTypes.number,
  }).isRequired,
  isActive: PropTypes.bool,
  isCompleted: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  index: PropTypes.number,
};

export default LessonItem;
