/**
 * Courses Page Component
 * Main courses listing page - Refactored following SOLID Principles
 *
 * Architecture:
 * - Single Responsibility: Each component handles one concern
 * - Open/Closed: Components extensible through props
 * - Liskov Substitution: Components can be substituted with similar interfaces
 * - Interface Segregation: Props are specific to each component's needs
 * - Dependency Inversion: Business logic abstracted to custom hooks
 */

import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchLatestCourses,
  fetchFeaturedCourses,
  fetchScholarXCourses,
} from "../../store/slices/courseSlice";
import { useCourseSearch } from "./hooks";
import { SearchHero, SearchResults, CourseSection } from "./components";
import styles from "./Courses.module.css";

/**
 * Courses Page - Main container component
 * Orchestrates data fetching and component composition
 */
const Courses = () => {
  const dispatch = useDispatch();

  // Redux state
  const {
    latest,
    featured,
    scholarx,
    loading,
    latestPagination,
    featuredPagination,
    scholarxPagination,
  } = useSelector((state) => state.course);

  // Pagination state
  const [latestPage, setLatestPage] = useState(1);
  const [featuredPage, setFeaturedPage] = useState(1);
  const [scholarxPage, setScholarxPage] = useState(1);

  // Search hook
  const {
    searchTerm,
    setSearchTerm,
    courses: searchResults,
    pagination: searchPagination,
    page: searchPage,
    isLoading: searchLoading,
    hasActiveSearch,
    goToNextPage: searchNextPage,
    goToPrevPage: searchPrevPage,
  } = useCourseSearch(400);

  // Fetch courses on page change
  useEffect(() => {
    dispatch(fetchLatestCourses(latestPage));
  }, [dispatch, latestPage]);

  useEffect(() => {
    dispatch(fetchFeaturedCourses(featuredPage));
  }, [dispatch, featuredPage]);

  useEffect(() => {
    dispatch(fetchScholarXCourses(scholarxPage));
  }, [dispatch, scholarxPage]);

  // Pagination handlers
  const handleLatestNext = useCallback(() => {
    if (latestPagination?.hasNextPage) {
      setLatestPage((p) => p + 1);
    }
  }, [latestPagination?.hasNextPage]);

  const handleLatestPrev = useCallback(() => {
    if (latestPagination?.hasPreviousPage) {
      setLatestPage((p) => p - 1);
    }
  }, [latestPagination?.hasPreviousPage]);

  const handleFeaturedNext = useCallback(() => {
    if (featuredPagination?.hasNextPage) {
      setFeaturedPage((p) => p + 1);
    }
  }, [featuredPagination?.hasNextPage]);

  const handleFeaturedPrev = useCallback(() => {
    if (featuredPagination?.hasPreviousPage) {
      setFeaturedPage((p) => p - 1);
    }
  }, [featuredPagination?.hasPreviousPage]);

  const handleScholarxNext = useCallback(() => {
    if (scholarxPagination?.hasNextPage) {
      setScholarxPage((p) => p + 1);
    }
  }, [scholarxPagination?.hasNextPage]);

  const handleScholarxPrev = useCallback(() => {
    if (scholarxPagination?.hasPreviousPage) {
      setScholarxPage((p) => p - 1);
    }
  }, [scholarxPagination?.hasPreviousPage]);

  return (
    <main className={styles.page}>
      {/* Hero Search Section */}
      <SearchHero
        title="Discover Our Courses"
        subtitle="Courses"
        description="Scholarships, Mentorship & Skill Development Opportunities"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search by course title"
      />

      {/* Main Content */}
      <div className={styles.container}>
        {hasActiveSearch ? (
          /* Search Results */
          <SearchResults
            searchTerm={searchTerm}
            courses={searchResults}
            pagination={searchPagination}
            page={searchPage}
            isLoading={searchLoading}
            onNextPage={searchNextPage}
            onPrevPage={searchPrevPage}
          />
        ) : (
          /* Course Sections */
          <>
            {/* Latest Courses */}
            <CourseSection
              title="Courses"
              highlightedWord="Latest"
              courses={latest}
              section="latest"
              isLoading={loading && latest.length === 0}
              pagination={latestPagination}
              currentPage={latestPage}
              onNextPage={handleLatestNext}
              onPrevPage={handleLatestPrev}
            />

            {/* Featured Courses */}
            {featured?.length > 0 && (
              <CourseSection
                title="Courses"
                highlightedWord="Featured"
                courses={featured}
                section="featured"
                pagination={featuredPagination}
                currentPage={featuredPage}
                onNextPage={handleFeaturedNext}
                onPrevPage={handleFeaturedPrev}
              />
            )}

            {/* ScholarX Courses */}
            {scholarx?.length > 0 && (
              <CourseSection
                title="Courses"
                highlightedWord="ScholarX"
                courses={scholarx}
                section="scholarx"
                pagination={scholarxPagination}
                currentPage={scholarxPage}
                onNextPage={handleScholarxNext}
                onPrevPage={handleScholarxPrev}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Courses;
