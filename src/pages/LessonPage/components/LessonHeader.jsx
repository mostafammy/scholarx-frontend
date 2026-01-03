/**
 * LessonHeader Component
 * Displays course title and current lesson info
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import styles from "./LessonHeader.module.css";

const LessonHeader = memo(function LessonHeader({
  courseTitle,
  lessonTitle,
  currentLessonNumber,
  totalLessons,
}) {
  return (
    <div className={styles.header}>
      <h1 className={styles.courseTitle}>{courseTitle || "Course"}</h1>
      {lessonTitle && (
        <div className={styles.lessonInfo}>
          <span className={styles.lessonTitle}>{lessonTitle}</span>
          <span className={styles.lessonCount}>
            <span className={styles.currentLesson}>{currentLessonNumber}</span>
            <span className={styles.separator}>/</span>
            <span className={styles.totalLessons}>{totalLessons}</span>
          </span>
        </div>
      )}
    </div>
  );
});

LessonHeader.propTypes = {
  courseTitle: PropTypes.string,
  lessonTitle: PropTypes.string,
  currentLessonNumber: PropTypes.number,
  totalLessons: PropTypes.number,
};

export default LessonHeader;
