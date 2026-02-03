/**
 * CourseCurriculum Component
 * Expandable accordion-based curriculum viewer
 *
 * Architecture:
 * - Single Responsibility: Curriculum display only
 * - Graceful fallback when no curriculum data
 * - Smooth height animations for expand/collapse
 */

import React, { memo, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./CourseCurriculum.module.css";

/**
 * LessonItem - Individual lesson row
 */
const LessonItem = ({ lesson, index }) => {
  const typeIcons = {
    video: "🎬",
    quiz: "📝",
    pdf: "📄",
    article: "📰",
    assignment: "✍️",
  };

  return (
    <div
      className={styles.lesson}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className={styles.lessonInfo}>
        <span className={styles.lessonIcon}>
          {typeIcons[lesson.type] || "📚"}
        </span>
        <span className={styles.lessonTitle}>{lesson.title}</span>
      </div>
      <div className={styles.lessonMeta}>
        {lesson.duration && (
          <span className={styles.lessonDuration}>{lesson.duration}</span>
        )}
        {lesson.isPreview && (
          <span className={styles.previewBadge}>Preview</span>
        )}
      </div>
    </div>
  );
};

/**
 * ChapterAccordion - Expandable chapter section
 */
const ChapterAccordion = ({ chapter, index, isOpen, onToggle }) => {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen, chapter.lessons?.length]);

  const lessonsCount = chapter.lessons?.length || 0;
  const totalDuration = chapter.duration || "";

  return (
    <div
      className={`${styles.chapter} ${isOpen ? styles.open : ""}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <button
        className={styles.chapterHeader}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <div className={styles.chapterInfo}>
          <span className={styles.chapterNumber}>{index + 1}</span>
          <div className={styles.chapterTitleWrapper}>
            <h4 className={styles.chapterTitle}>{chapter.title}</h4>
            <span className={styles.chapterMeta}>
              {lessonsCount} {lessonsCount === 1 ? "lesson" : "lessons"}
              {totalDuration && ` • ${totalDuration}`}
            </span>
          </div>
        </div>
        <span className={styles.chevron}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>

      <div className={styles.chapterContent} style={{ height: `${height}px` }}>
        <div ref={contentRef} className={styles.lessonsWrapper}>
          {chapter.lessons?.map((lesson, lessonIndex) => (
            <LessonItem
              key={lesson.id || lessonIndex}
              lesson={lesson}
              index={lessonIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * CourseCurriculum - Main component
 */
const CourseCurriculum = ({ chapters, totalLessons, totalDuration }) => {
  const [openChapter, setOpenChapter] = useState(0); // First chapter open by default

  // Graceful fallback when no curriculum data
  if (!chapters || chapters.length === 0) {
    return null;
  }

  const handleToggle = (index) => {
    setOpenChapter(openChapter === index ? -1 : index);
  };

  return (
    <section className={styles.curriculum}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.titleWrapper}>
            <h2 className={styles.sectionTitle}>Course Curriculum</h2>
            <p className={styles.sectionSubtitle}>
              Explore what you'll learn in this course
            </p>
          </div>
          <div className={styles.summaryBadges}>
            {totalLessons > 0 && (
              <span className={styles.summaryBadge}>
                📚 {totalLessons} lessons
              </span>
            )}
            {totalDuration && (
              <span className={styles.summaryBadge}>⏱️ {totalDuration}</span>
            )}
          </div>
        </div>

        {/* Chapters Accordion */}
        <div className={styles.chaptersWrapper}>
          {chapters.map((chapter, index) => (
            <ChapterAccordion
              key={chapter.id || index}
              chapter={chapter}
              index={index}
              isOpen={openChapter === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

CourseCurriculum.propTypes = {
  chapters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string.isRequired,
      duration: PropTypes.string,
      lessons: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          title: PropTypes.string.isRequired,
          type: PropTypes.oneOf([
            "video",
            "quiz",
            "pdf",
            "article",
            "assignment",
          ]),
          duration: PropTypes.string,
          isPreview: PropTypes.bool,
        }),
      ),
    }),
  ),
  totalLessons: PropTypes.number,
  totalDuration: PropTypes.string,
};

CourseCurriculum.defaultProps = {
  chapters: [],
  totalLessons: 0,
  totalDuration: "",
};

export default memo(CourseCurriculum);
