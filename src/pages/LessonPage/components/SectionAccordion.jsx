/**
 * SectionAccordion Component
 * Collapsible section with lessons
 */

import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import LessonItem from "./LessonItem";
import styles from "./SectionAccordion.module.css";

const SectionAccordion = memo(function SectionAccordion({
  section,
  sectionIndex,
  currentLessonId,
  completedLessons,
  onLessonSelect,
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const completedInSection = section.lessons.filter((lesson) =>
    completedLessons.includes(lesson._id)
  ).length;
  const allCompleted = completedInSection === section.lessons.length;

  return (
    <div
      className={styles.section}
      style={{ "--animation-delay": `${sectionIndex * 0.1}s` }}
    >
      <button
        className={`${styles.header} ${isExpanded ? styles.expanded : ""}`}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <div className={styles.headerLeft}>
          <span className={styles.sectionNumber}>
            {section.index || sectionIndex + 1}
          </span>
          <span className={styles.sectionTitle}>{section.title}</span>
        </div>

        <div className={styles.headerRight}>
          {allCompleted && (
            <span className={styles.completedBadge}>
              <span className={styles.badgeIcon}>✓</span>
              Done
            </span>
          )}
          <span className={styles.lessonCount}>
            {completedInSection}/{section.lessons.length}
          </span>
          <span
            className={`${styles.chevron} ${isExpanded ? styles.rotated : ""}`}
          >
            ▼
          </span>
        </div>
      </button>

      <div className={`${styles.content} ${isExpanded ? styles.expanded : ""}`}>
        <div className={styles.lessonsList}>
          {section.lessons.map((lesson, index) => (
            <LessonItem
              key={lesson._id}
              lesson={lesson}
              index={index}
              isActive={lesson._id === currentLessonId}
              isCompleted={completedLessons.includes(lesson._id)}
              onClick={() => onLessonSelect(lesson)}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

SectionAccordion.propTypes = {
  section: PropTypes.shape({
    index: PropTypes.number,
    title: PropTypes.string.isRequired,
    lessons: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  sectionIndex: PropTypes.number.isRequired,
  currentLessonId: PropTypes.string,
  completedLessons: PropTypes.arrayOf(PropTypes.string),
  onLessonSelect: PropTypes.func.isRequired,
};

export default SectionAccordion;
