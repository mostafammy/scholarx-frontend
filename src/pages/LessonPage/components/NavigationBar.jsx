/**
 * NavigationBar Component
 * Provides navigation controls for lesson page
 * - Back to course button
 * - Previous/Next lesson navigation
 * - Keyboard shortcuts indicator
 */

import React, { memo, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import styles from "./NavigationBar.module.css";

const NavigationBar = memo(function NavigationBar({
  courseId,
  courseTitle,
  currentLessonNumber,
  totalLessons,
  onPreviousLesson,
  onNextLesson,
  hasPrevious,
  hasNext,
  isTheaterMode,
  onToggleTheaterMode,
}) {
  const navigate = useNavigate();

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        return;
      }

      switch (e.key) {
        case "ArrowLeft":
          if (e.shiftKey && hasPrevious) {
            e.preventDefault();
            onPreviousLesson();
          }
          break;
        case "ArrowRight":
          if (e.shiftKey && hasNext) {
            e.preventDefault();
            onNextLesson();
          }
          break;
        case "Escape":
          if (isTheaterMode) {
            e.preventDefault();
            onToggleTheaterMode();
          }
          break;
        case "t":
        case "T":
          if (e.shiftKey) {
            e.preventDefault();
            onToggleTheaterMode();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    hasPrevious,
    hasNext,
    onPreviousLesson,
    onNextLesson,
    isTheaterMode,
    onToggleTheaterMode,
  ]);

  const handleBackToCourse = useCallback(() => {
    navigate(`/CoursePage/${courseId}`);
  }, [navigate, courseId]);

  const handleBackToCourses = useCallback(() => {
    navigate("/mycourses");
  }, [navigate]);

  return (
    <nav
      className={`${styles.navbar} ${isTheaterMode ? styles.theaterMode : ""}`}
    >
      {/* Left Section - Back Navigation */}
      <div className={styles.leftSection}>
        <button
          className={styles.backButton}
          onClick={handleBackToCourse}
          aria-label="Back to course"
        >
          <svg
            className={styles.backIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className={styles.backText}>Back to Course</span>
        </button>

        <div className={styles.breadcrumb}>
          <button
            className={styles.breadcrumbLink}
            onClick={handleBackToCourses}
          >
            My Courses
          </button>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent} title={courseTitle}>
            {courseTitle?.length > 30
              ? `${courseTitle.slice(0, 30)}...`
              : courseTitle}
          </span>
        </div>
      </div>

      {/* Center Section - Lesson Navigation */}
      <div className={styles.centerSection}>
        <button
          className={`${styles.navButton} ${
            !hasPrevious ? styles.disabled : ""
          }`}
          onClick={onPreviousLesson}
          disabled={!hasPrevious}
          aria-label="Previous lesson"
          title="Previous lesson (Shift + ←)"
        >
          <svg
            className={styles.navIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className={styles.navText}>Previous</span>
        </button>

        <div className={styles.lessonIndicator}>
          <span className={styles.lessonCurrent}>{currentLessonNumber}</span>
          <span className={styles.lessonSeparator}>of</span>
          <span className={styles.lessonTotal}>{totalLessons}</span>
        </div>

        <button
          className={`${styles.navButton} ${styles.nextButton} ${
            !hasNext ? styles.disabled : ""
          }`}
          onClick={onNextLesson}
          disabled={!hasNext}
          aria-label="Next lesson"
          title="Next lesson (Shift + →)"
        >
          <span className={styles.navText}>Next</span>
          <svg
            className={styles.navIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Right Section - View Controls */}
      <div className={styles.rightSection}>
        <div className={styles.keyboardHint}>
          <kbd className={styles.kbd}>Shift</kbd>
          <span>+</span>
          <kbd className={styles.kbd}>←→</kbd>
          <span className={styles.hintText}>Navigate</span>
        </div>

        <button
          className={`${styles.theaterButton} ${
            isTheaterMode ? styles.active : ""
          }`}
          onClick={onToggleTheaterMode}
          aria-label={
            isTheaterMode ? "Exit theater mode" : "Enter theater mode"
          }
          title="Theater mode (Shift + T)"
        >
          {isTheaterMode ? (
            <svg
              className={styles.theaterIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
              />
            </svg>
          ) : (
            <svg
              className={styles.theaterIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
              />
            </svg>
          )}
          <span className={styles.theaterText}>
            {isTheaterMode ? "Exit" : "Theater"}
          </span>
        </button>
      </div>
    </nav>
  );
});

NavigationBar.propTypes = {
  courseId: PropTypes.string.isRequired,
  courseTitle: PropTypes.string,
  currentLessonNumber: PropTypes.number.isRequired,
  totalLessons: PropTypes.number.isRequired,
  onPreviousLesson: PropTypes.func.isRequired,
  onNextLesson: PropTypes.func.isRequired,
  hasPrevious: PropTypes.bool.isRequired,
  hasNext: PropTypes.bool.isRequired,
  isTheaterMode: PropTypes.bool,
  onToggleTheaterMode: PropTypes.func.isRequired,
};

export default NavigationBar;
