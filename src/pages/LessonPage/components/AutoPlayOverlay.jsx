/**
 * AutoPlayOverlay Component
 * Shows countdown before auto-playing next lesson
 * User can cancel or skip immediately
 */

import React, { memo, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import styles from "./AutoPlayOverlay.module.css";

const COUNTDOWN_SECONDS = 5;

const AutoPlayOverlay = memo(function AutoPlayOverlay({
  isVisible,
  nextLesson,
  onPlayNext,
  onCancel,
}) {
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [isPaused, setIsPaused] = useState(false);

  // Reset countdown when overlay becomes visible
  useEffect(() => {
    if (isVisible) {
      setCountdown(COUNTDOWN_SECONDS);
      setIsPaused(false);
    }
  }, [isVisible]);

  // Countdown timer
  useEffect(() => {
    if (!isVisible || isPaused) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onPlayNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, isPaused, onPlayNext]);

  const handlePauseToggle = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  if (!isVisible || !nextLesson) return null;

  const progress = ((COUNTDOWN_SECONDS - countdown) / COUNTDOWN_SECONDS) * 100;

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        {/* Progress Ring */}
        <div className={styles.progressRing}>
          <svg className={styles.ringSvg} viewBox="0 0 100 100">
            <circle
              className={styles.ringBackground}
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="6"
            />
            <circle
              className={styles.ringProgress}
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="6"
              strokeDasharray={`${progress * 2.83} 283`}
              style={{
                transition: isPaused ? "none" : "stroke-dasharray 1s linear",
              }}
            />
          </svg>
          <div className={styles.countdownNumber}>{countdown}</div>
        </div>

        {/* Next Lesson Info */}
        <div className={styles.nextLessonInfo}>
          <span className={styles.upNextLabel}>Up Next</span>
          <h3 className={styles.nextLessonTitle}>{nextLesson.title}</h3>
          {nextLesson.description && (
            <p className={styles.nextLessonDescription}>
              {nextLesson.description.slice(0, 100)}
              {nextLesson.description.length > 100 ? "..." : ""}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button
            className={styles.playNowButton}
            onClick={onPlayNext}
            aria-label="Play next lesson now"
          >
            <svg
              className={styles.playIcon}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            Play Now
          </button>

          <button
            className={styles.pauseButton}
            onClick={handlePauseToggle}
            aria-label={isPaused ? "Resume countdown" : "Pause countdown"}
          >
            {isPaused ? (
              <>
                <svg
                  className={styles.buttonIcon}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Resume
              </>
            ) : (
              <>
                <svg
                  className={styles.buttonIcon}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
                Pause
              </>
            )}
          </button>

          <button
            className={styles.cancelButton}
            onClick={onCancel}
            aria-label="Cancel auto-play"
          >
            <svg
              className={styles.buttonIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Cancel
          </button>
        </div>

        {/* Keyboard hint */}
        <div className={styles.keyboardHint}>
          Press <kbd>Space</kbd> to play, <kbd>Esc</kbd> to cancel
        </div>
      </div>
    </div>
  );
});

AutoPlayOverlay.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  nextLesson: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
  }),
  onPlayNext: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AutoPlayOverlay;
