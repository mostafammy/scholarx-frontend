/**
 * useLessonCompletion Hook
 * Manages lesson completion logic and notifications
 * Following Single Responsibility Principle
 */

import { useCallback, useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  markLessonComplete as markLessonCompleteCertificate,
  getCompletedLessons,
  getCourseCompletionStatus,
} from "../../../store/slices/certificateSlice";
import { ANIMATION_DURATIONS } from "../constants";

/**
 * Custom hook for managing lesson completion
 * @param {string} courseId - The course ID
 * @param {Object} user - Current user object
 * @param {Function} onComplete - Callback when lesson is completed
 * @returns {Object} Completion handlers and state
 */
export const useLessonCompletion = (courseId, user, onComplete) => {
  const dispatch = useDispatch();
  const [showNotification, setShowNotification] = useState(false);
  const playbackMetricsRef = useRef({ currentTime: 0, duration: 0 });
  const notificationTimeoutRef = useRef(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  // Handle lesson completion
  const handleLessonComplete = useCallback(
    (lessonId) => {
      if (!lessonId || !courseId || !user) {
        return;
      }

      const { duration } = playbackMetricsRef.current;

      dispatch(
        markLessonCompleteCertificate({
          lessonId,
          courseId,
          watchTime: duration,
          completionPercentage: 100,
        })
      ).then(() => {
        dispatch(getCompletedLessons(courseId));
        dispatch(getCourseCompletionStatus(courseId));
      });

      // Notify parent
      if (onComplete) {
        onComplete(lessonId);
      }

      // Show notification
      setShowNotification(true);
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
      notificationTimeoutRef.current = setTimeout(
        () => setShowNotification(false),
        ANIMATION_DURATIONS.notification
      );
    },
    [dispatch, courseId, user, onComplete]
  );

  // Handle playback progress
  const handlePlaybackProgress = useCallback(
    ({ currentTime = 0, duration = 0 }) => {
      playbackMetricsRef.current = { currentTime, duration };
    },
    []
  );

  // Dismiss notification
  const dismissNotification = useCallback(() => {
    setShowNotification(false);
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
  }, []);

  return {
    showNotification,
    handleLessonComplete,
    handlePlaybackProgress,
    dismissNotification,
  };
};
