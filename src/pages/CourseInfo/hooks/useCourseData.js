/**
 * useCourseData Hook
 * Handles course data fetching and state management
 * Following Single Responsibility and Dependency Inversion Principles
 */

import { useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchCourseDetails,
  clearCurrentCourse,
} from "../../../store/slices/courseSlice";
import { mapCourseData, createCourseStats } from "../utils/courseDataMapper";
import courseDataFallback from "../CourseData";

/**
 * Custom hook for managing course data
 * @returns {Object} Course data and loading states
 */
export const useCourseData = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();

  // Select course state from Redux
  const courseState = useSelector((state) => state?.course) || {};
  const { currentCourse, loading: isLoading, error } = courseState;

  // Fetch course data on mount/courseId change
  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseDetails(courseId));
    }

    return () => {
      dispatch(clearCurrentCourse());
    };
  }, [dispatch, courseId]);

  // Normalize course data using mapper
  const normalizedCourse = useMemo(() => {
    const rawCourse = currentCourse || courseDataFallback;
    return mapCourseData(rawCourse, courseDataFallback);
  }, [currentCourse]);

  // Generate stats array
  const courseStats = useMemo(
    () => createCourseStats(normalizedCourse),
    [normalizedCourse]
  );

  // Determine loading state (only show loading if no data available)
  const showLoading = isLoading && !currentCourse;

  // Determine error state
  const showError = error && !currentCourse;

  // Refetch function for manual refresh
  const refetch = useCallback(() => {
    if (courseId) {
      dispatch(fetchCourseDetails(courseId));
    }
  }, [dispatch, courseId]);

  return {
    courseId,
    course: normalizedCourse,
    courseStats,
    isLoading: showLoading,
    error: showError ? error : null,
    refetch,
    rawCourse: currentCourse,
  };
};

export default useCourseData;
