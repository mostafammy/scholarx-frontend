/**
 * CourseSidebar Component
 * Right sidebar with sections and progress
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import ProgressBar from "./ProgressBar";
import SectionAccordion from "./SectionAccordion";
import styles from "./CourseSidebar.module.css";

const CourseSidebar = memo(function CourseSidebar({
  sections,
  currentLessonId,
  completedLessons,
  progress,
  completedCount,
  totalLessons,
  isCourseCompleted,
  onLessonSelect,
}) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span className={styles.titleIcon}>📖</span>
            Course Sections
          </h2>
          {isCourseCompleted && (
            <span className={styles.completedBadge}>
              <span className={styles.badgeIcon}>✅</span>
              Completed
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <ProgressBar
          progress={progress}
          completedCount={completedCount}
          totalLessons={totalLessons}
          isCompleted={isCourseCompleted}
        />

        {/* Sections List */}
        <div className={styles.sectionsList}>
          {sections.map((section, index) => (
            <SectionAccordion
              key={section.title}
              section={section}
              sectionIndex={index}
              currentLessonId={currentLessonId}
              completedLessons={completedLessons}
              onLessonSelect={onLessonSelect}
            />
          ))}
        </div>
      </div>
    </aside>
  );
});

CourseSidebar.propTypes = {
  sections: PropTypes.array.isRequired,
  currentLessonId: PropTypes.string,
  completedLessons: PropTypes.arrayOf(PropTypes.string),
  progress: PropTypes.number.isRequired,
  completedCount: PropTypes.number.isRequired,
  totalLessons: PropTypes.number.isRequired,
  isCourseCompleted: PropTypes.bool,
  onLessonSelect: PropTypes.func.isRequired,
};

export default CourseSidebar;
