/**
 * QuickActions Component
 * Floating action bar with quick access to common features
 */

import React, { memo, useState, useCallback } from "react";
import PropTypes from "prop-types";
import styles from "./QuickActions.module.css";

const QuickActions = memo(function QuickActions({
  isLessonCompleted,
  onMarkComplete,
  onToggleNotes,
  onToggleSidebar,
  isSidebarVisible,
  isNotesExpanded,
  playbackSpeed,
  onSpeedChange,
}) {
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  const handleSpeedSelect = useCallback(
    (speed) => {
      onSpeedChange(speed);
      setIsSpeedMenuOpen(false);
    },
    [onSpeedChange]
  );

  return (
    <div className={styles.container}>
      <div className={styles.actionsBar}>
        {/* Mark Complete */}
        <button
          className={`${styles.actionButton} ${
            isLessonCompleted ? styles.completed : ""
          }`}
          onClick={onMarkComplete}
          aria-label={
            isLessonCompleted ? "Lesson completed" : "Mark as complete"
          }
          title={isLessonCompleted ? "Lesson completed" : "Mark as complete"}
        >
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            {isLessonCompleted ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            )}
          </svg>
          <span className={styles.actionLabel}>
            {isLessonCompleted ? "Completed" : "Complete"}
          </span>
        </button>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Playback Speed - TEMPORARILY DISABLED */}
        {/* TODO: Re-enable after implementing proper speed sync functionality */}
        {false && (
          <>
            <div className={styles.speedControl}>
              <button
                className={`${styles.actionButton} ${
                  isSpeedMenuOpen ? styles.active : ""
                }`}
                onClick={() => setIsSpeedMenuOpen(!isSpeedMenuOpen)}
                aria-label="Playback speed"
                title="Playback speed"
              >
                <svg
                  className={styles.icon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span className={styles.actionLabel}>{playbackSpeed}x</span>
              </button>

              {isSpeedMenuOpen && (
                <div className={styles.speedMenu}>
                  <div className={styles.speedMenuTitle}>Playback Speed</div>
                  {speedOptions.map((speed) => (
                    <button
                      key={speed}
                      className={`${styles.speedOption} ${
                        playbackSpeed === speed ? styles.selected : ""
                      }`}
                      onClick={() => handleSpeedSelect(speed)}
                    >
                      <span>{speed}x</span>
                      {playbackSpeed === speed && (
                        <svg
                          className={styles.checkIcon}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className={styles.divider} />
          </>
        )}

        {/* Toggle Notes */}
        <button
          className={`${styles.actionButton} ${
            isNotesExpanded ? styles.active : ""
          }`}
          onClick={onToggleNotes}
          aria-label={isNotesExpanded ? "Hide notes" : "Show notes"}
          title={isNotesExpanded ? "Hide notes" : "Show notes"}
        >
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <span className={styles.actionLabel}>Notes</span>
        </button>

        {/* Toggle Sidebar (Mobile) */}
        <button
          className={`${styles.actionButton} ${styles.sidebarToggle} ${
            isSidebarVisible ? styles.active : ""
          }`}
          onClick={onToggleSidebar}
          aria-label={isSidebarVisible ? "Hide lessons" : "Show lessons"}
          title={isSidebarVisible ? "Hide lessons" : "Show lessons"}
        >
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
          <span className={styles.actionLabel}>Lessons</span>
        </button>
      </div>
    </div>
  );
});

QuickActions.propTypes = {
  isLessonCompleted: PropTypes.bool,
  onMarkComplete: PropTypes.func.isRequired,
  onToggleNotes: PropTypes.func.isRequired,
  onToggleSidebar: PropTypes.func.isRequired,
  isSidebarVisible: PropTypes.bool,
  isNotesExpanded: PropTypes.bool,
  playbackSpeed: PropTypes.number,
  onSpeedChange: PropTypes.func.isRequired,
};

QuickActions.defaultProps = {
  playbackSpeed: 1,
};

export default QuickActions;
