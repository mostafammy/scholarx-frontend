/**
 * usePagination Hook
 * Manages pagination state for a course section
 * Following Single Responsibility Principle
 */

import { useState, useCallback, useEffect } from "react";

/**
 * Custom hook for pagination management
 * @param {Function} fetchFn - Function to fetch data for a page
 * @param {Object} paginationData - Pagination data from Redux
 * @returns {Object} Pagination state and actions
 */
export const usePagination = (fetchFn, paginationData = {}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data when page changes
  useEffect(() => {
    fetchFn(currentPage);
  }, [currentPage, fetchFn]);

  const goToNextPage = useCallback(() => {
    if (paginationData.hasNextPage) {
      setCurrentPage((p) => p + 1);
    }
  }, [paginationData.hasNextPage]);

  const goToPrevPage = useCallback(() => {
    if (paginationData.hasPreviousPage) {
      setCurrentPage((p) => p - 1);
    }
  }, [paginationData.hasPreviousPage]);

  const goToPage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const reset = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    hasNextPage: paginationData.hasNextPage || false,
    hasPrevPage: paginationData.hasPreviousPage || false,
    totalPages: paginationData.totalPages || 1,
    goToNextPage,
    goToPrevPage,
    goToPage,
    reset,
  };
};

export default usePagination;
