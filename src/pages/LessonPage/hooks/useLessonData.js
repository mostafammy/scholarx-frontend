/**
 * useLessonData Hook
 * Manages lesson data fetching and state
 * Following Single Responsibility Principle
 */

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCourseLessons,
  checkCourseSubscription,
} from "../../../store/slices/lessonSlice";
import {
  getCompletedLessons,
  getCourseCompletionStatus,
} from "../../../store/slices/certificateSlice";
import { courseService } from "../../../services/api";

/**
 * Custom hook for managing lesson data
 * @param {string} courseId - The course ID
 * @param {Object} user - Current user object
 * @param {boolean} userLoading - User loading state
 * @returns {Object} Lesson data and actions
 */
export const useLessonData = (courseId, user, userLoading) => {
  const dispatch = useDispatch();
  const [currentLesson, setCurrentLesson] = useState(null);
  const [localCompletedLessons, setLocalCompletedLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redux lesson state
  const {
    sections,
    course,
    isSubscribed,
    isBlocked,
    loading: reduxLoading,
    error: reduxError,
  } = useSelector((state) => state.lessons);

  // Redux certificate state
  const { completedLessons: certificateCompletedLessons, completedCourses } =
    useSelector((state) => state.certificates);

  // Fetch course lessons
  useEffect(() => {
    if (!userLoading && courseId) {
      setLoading(true);
      dispatch(fetchCourseLessons(courseId))
        .then((result) => {
          if (
            result.payload?.sections?.length > 0 &&
            result.payload.sections[0].lessons?.length > 0
          ) {
            setCurrentLesson(result.payload.sections[0].lessons[0]);
          }
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [dispatch, courseId, userLoading]);

  // Check subscription and fetch completion data
  useEffect(() => {
    if (user && courseId) {
      dispatch(checkCourseSubscription({ courseId, userId: user._id }));
      dispatch(getCompletedLessons(courseId));
      dispatch(getCourseCompletionStatus(courseId));
    }
  }, [dispatch, courseId, user]);

  // Refresh completion data when lesson changes
  useEffect(() => {
    if (user && courseId && currentLesson) {
      dispatch(getCompletedLessons(courseId));
      dispatch(getCourseCompletionStatus(courseId));
    }
  }, [dispatch, courseId, currentLesson, user]);

  // Computed values
  const isFreeCourse = courseService.isFreeCourse(course);
  const hasCourseAccess = Boolean(isSubscribed || course?.isSubscribed);

  // Progress calculation
  const totalLessons = sections.reduce(
    (acc, sec) => acc + sec.lessons.length,
    0
  );
  const certificateCompleted = certificateCompletedLessons[courseId] || [];
  const allCompletedLessons = [
    ...new Set([...certificateCompleted, ...localCompletedLessons]),
  ];
  const completedCount = allCompletedLessons.length;
  const progress = totalLessons ? (completedCount / totalLessons) * 100 : 0;
  const isCourseCompleted = completedCount >= totalLessons && totalLessons > 0;
  const courseCompletion = completedCourses.find(
    (cc) => cc.course._id === courseId
  );

  // Get current lesson number
  const getCurrentLessonNumber = useCallback(() => {
    if (!currentLesson) return 0;
    let count = 0;
    for (const section of sections) {
      for (const lesson of section.lessons) {
        count++;
        if (lesson._id === currentLesson._id) {
          return count;
        }
      }
    }
    return 0;
  }, [currentLesson, sections]);

  // Select lesson
  const selectLesson = useCallback((lesson) => {
    setCurrentLesson(lesson);
  }, []);

  // Add completed lesson locally
  const addCompletedLesson = useCallback((lessonId) => {
    setLocalCompletedLessons((prev) => {
      if (!prev.includes(lessonId)) {
        return [...prev, lessonId];
      }
      return prev;
    });
  }, []);

  return {
    // State
    sections,
    course,
    currentLesson,
    loading: loading || reduxLoading,
    error: error || reduxError,
    isBlocked,
    isFreeCourse,
    hasCourseAccess,
    // Progress
    totalLessons,
    completedCount,
    progress,
    allCompletedLessons,
    isCourseCompleted,
    courseCompletion,
    // Actions
    selectLesson,
    addCompletedLesson,
    getCurrentLessonNumber,
    // Dispatch for external use
    dispatch,
  };
};
