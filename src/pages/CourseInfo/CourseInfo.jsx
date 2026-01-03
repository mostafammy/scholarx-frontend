/**
 * CoursePage Component
 * Main course information page - Refactored following SOLID Principles
 *
 * Architecture:
 * - Single Responsibility: Each component handles one concern
 * - Open/Closed: Components are extensible through props without modification
 * - Liskov Substitution: Components can be substituted with similar interfaces
 * - Interface Segregation: Props are specific to each component's needs
 * - Dependency Inversion: Business logic abstracted to custom hooks
 */

import React, { useMemo } from "react";
import { useParams } from "react-router-dom";

import { useUser } from "../../context/UserContext";
import BlockedUserMessage from "../../components/BlockedUserMessage/BlockedUserMessage";
import { useCourseData, useSubscriptionStatus } from "./hooks";
import {
  CourseHeader,
  CourseSection,
  CourseDescription,
  CheckList,
  LoadingState,
  ErrorState,
} from "./components";
import { SECTION_ICONS } from "./constants";
import styles from "./CourseInfo.module.css";

/**
 * CoursePage - Main container component
 * Orchestrates data fetching and component composition
 */
const CoursePage = () => {
  const { courseId } = useParams();
  const { user } = useUser();

  // Custom hooks for data management (Dependency Inversion)
  const { course, courseStats, isLoading, error, refetch, rawCourse } =
    useCourseData();

  const { isSubscribed } = useSubscriptionStatus(courseId);

  // Memoized course with access status
  const courseWithAccess = useMemo(
    () => (isSubscribed ? { ...rawCourse, isSubscribed: true } : rawCourse),
    [rawCourse, isSubscribed]
  );

  // Handle blocked user state
  if (user?.isBlocked) {
    return (
      <BlockedUserMessage
        blockReason={user.blockReason}
        blockedAt={user.blockedAt}
      />
    );
  }

  // Handle loading state
  if (isLoading) {
    return <LoadingState message="Loading course details..." />;
  }

  // Handle error state
  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  return (
    <main className={styles.container}>
      {/* Hero Header Section */}
      <CourseHeader
        headerImage={course.headerImage}
        title={course.title}
        tagline={course.tagline}
        rating={course.rating}
        totalRatings={course.totalRatings}
        stats={courseStats}
        courseId={courseId}
        course={courseWithAccess}
        isSubscribed={isSubscribed}
      />

      {/* Course Description Section */}
      <CourseSection
        iconSrc={SECTION_ICONS.description.src}
        iconAlt={SECTION_ICONS.description.alt}
        title="Course Description"
        variant="description"
      >
        <CourseDescription description={course.description} />
      </CourseSection>

      {/* What You'll Learn Section */}
      <CourseSection
        iconSrc={SECTION_ICONS.learning.src}
        iconAlt={SECTION_ICONS.learning.alt}
        title="What You'll Learn"
        variant="learning"
      >
        <CheckList items={course.whatYouWillLearn} />
      </CourseSection>

      {/* Target Audience Section */}
      <CourseSection
        iconSrc={SECTION_ICONS.audience.src}
        iconAlt={SECTION_ICONS.audience.alt}
        title="Target Audience"
        variant="audience"
      >
        <CheckList items={course.targetAudience} />
      </CourseSection>
    </main>
  );
};

export default CoursePage;
