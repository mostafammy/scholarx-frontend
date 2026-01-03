/**
 * useCourses Hook
 * Manages course data fetching for all course sections
 * Following Single Responsibility and Dependency Inversion Principles
 */

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLatestCourses,
  fetchFeaturedCourses,
  fetchScholarXCourses,
} from "../../../store/slices/courseSlice";

/**
 * Custom hook for managing courses data
 * @returns {Object} Courses data and actions
 */
export const useCourses = () => {
  const dispatch = useDispatch();

  const {
    latest,
    featured,
    scholarx,
    loading,
    error,
    latestPagination,
    featuredPagination,
    scholarxPagination,
  } = useSelector((state) => state.course);

  // Fetch functions
  const fetchLatest = useCallback(
    (page = 1) => {
      dispatch(fetchLatestCourses(page));
    },
    [dispatch]
  );

  const fetchFeatured = useCallback(
    (page = 1) => {
      dispatch(fetchFeaturedCourses(page));
    },
    [dispatch]
  );

  const fetchScholarX = useCallback(
    (page = 1) => {
      dispatch(fetchScholarXCourses(page));
    },
    [dispatch]
  );

  // Refetch all
  const refetchAll = useCallback(() => {
    fetchLatest(1);
    fetchFeatured(1);
    fetchScholarX(1);
  }, [fetchLatest, fetchFeatured, fetchScholarX]);

  return {
    // Data
    latest,
    featured,
    scholarx,
    loading,
    error,
    // Pagination
    latestPagination,
    featuredPagination,
    scholarxPagination,
    // Actions
    fetchLatest,
    fetchFeatured,
    fetchScholarX,
    refetchAll,
  };
};

export default useCourses;
