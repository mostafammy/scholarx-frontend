/**
 * MiniProgress Component
 * Floating mini progress indicator
 * Shows visual timeline of lessons with completion status
 */

import React, { memo, useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./MiniProgress.module.css";

const MiniProgress = memo(function MiniProgress({
  sections,
  currentLessonId,
  completedLessons,
  onLessonSelect,
  totalLessons,
  completedCount,
}) {
  // Flatten lessons for timeline
  const allLessons = useMemo(() => {
    const lessons = [];
    sections.forEach((section, sectionIndex) => {
      section.lessons.forEach((lesson) => {
        lessons.push({
          ...lesson,
          sectionIndex,
          sectionTitle: section.title,
          globalIndex: lessons.length,
        });
      });
    });
    return lessons;
  }, [sections]);

  // Find current lesson index
  const currentIndex = useMemo(() => {
    return allLessons.findIndex((l) => l._id === currentLessonId);
  }, [allLessons, currentLessonId]);

  const progressPercent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className={styles.container}>
      {/* Progress Summary */}
      <div className={styles.summary}>
        <div className={styles.progressCircle}>
          <svg className={styles.circleSvg} viewBox="0 0 36 36">
            <path
              className={styles.circleBackground}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              strokeWidth="3"
            />
            <path
              className={styles.circleProgress}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              strokeWidth="3"
              strokeDasharray={`${progressPercent}, 100`}
            />
          </svg>
          <span className={styles.percentText}>{progressPercent}%</span>
        </div>
        <div className={styles.summaryText}>
          <span className={styles.summaryTitle}>Progress</span>
          <span className={styles.summaryCount}>
            {completedCount} / {totalLessons}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Timeline */}
      <div className={styles.timeline}>
        {allLessons.map((lesson, index) => {
          const isCompleted = completedLessons.includes(lesson._id);
          const isCurrent = lesson._id === currentLessonId;
          const isAhead = index > currentIndex;

          return (
            <button
              key={lesson._id}
              className={`${styles.timelineItem} ${
                isCompleted ? styles.completed : ""
              } ${isCurrent ? styles.current : ""} ${
                isAhead && !isCompleted ? styles.upcoming : ""
              }`}
              onClick={() => onLessonSelect(lesson)}
              title={`${lesson.title}${isCompleted ? " (Completed)" : ""}`}
              aria-label={`Go to lesson ${index + 1}: ${lesson.title}`}
            >
              {isCurrent && <span className={styles.currentPulse} />}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.completed}`} />
          <span>Done</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.current}`} />
          <span>Current</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.upcoming}`} />
          <span>Upcoming</span>
        </div>
      </div>
    </div>
  );
});

MiniProgress.propTypes = {
  sections: PropTypes.array.isRequired,
  currentLessonId: PropTypes.string,
  completedLessons: PropTypes.arrayOf(PropTypes.string),
  onLessonSelect: PropTypes.func.isRequired,
  totalLessons: PropTypes.number.isRequired,
  completedCount: PropTypes.number.isRequired,
};

export default MiniProgress;
