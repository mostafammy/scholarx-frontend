/**
 * useCourseSearch Hook
 * Manages course search functionality
 * Following Single Responsibility Principle
 */

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook for course search with debouncing
 * @param {number} debounceMs - Debounce delay in milliseconds
 * @returns {Object} Search state and actions
 */
export const useCourseSearch = (debounceMs = 300) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      setPage(1); // Reset to first page on new search
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedTerm.trim()) {
        setCourses([]);
        setPagination({});
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/courses/search?title=${encodeURIComponent(
            debouncedTerm.trim()
          )}&page=${page}`,
          { signal: abortControllerRef.current.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }

        const data = await response.json();
        setCourses(data.data?.courses || []);
        setPagination(data.data?.pagination || {});
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
          console.error("Search error:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedTerm, page]);

  // Navigation actions
  const goToNextPage = useCallback(() => {
    if (pagination.hasNextPage) {
      setPage((p) => p + 1);
    }
  }, [pagination.hasNextPage]);

  const goToPrevPage = useCallback(() => {
    if (pagination.hasPreviousPage) {
      setPage((p) => p - 1);
    }
  }, [pagination.hasPreviousPage]);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setDebouncedTerm("");
    setCourses([]);
    setPagination({});
    setPage(1);
    setError(null);
  }, []);

  const hasActiveSearch = debouncedTerm.trim().length > 0;

  return {
    // State
    searchTerm,
    courses,
    pagination,
    page,
    isLoading,
    error,
    hasActiveSearch,
    // Actions
    setSearchTerm,
    goToNextPage,
    goToPrevPage,
    clearSearch,
  };
};

export default useCourseSearch;
