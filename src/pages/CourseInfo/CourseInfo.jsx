/**
 * CoursePage Component
 * World-Class Course Information Page - Premium Redesign
 *
 * Architecture:
 * - Single Responsibility: Each component handles one concern
 * - Open/Closed: Components are extensible through props without modification
 * - Liskov Substitution: Components can be substituted with similar interfaces
 * - Interface Segregation: Props are specific to each component's needs
 * - Dependency Inversion: Business logic abstracted to custom hooks
 */

import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { useUser } from "../../context/UserContext";
import { courseService, authService } from "../../services/api";
import BlockedUserMessage from "../../components/BlockedUserMessage/BlockedUserMessage";
import useSalesInquiry from "../../hooks/useSalesInquiry";
import SalesInquiryModal from "../../components/SalesInquiryModal";
import { useCourseData, useSubscriptionStatus } from "./hooks";
import {
  CourseHero,
  CourseOverview,
  CourseSection,
  CourseDescription,
  CheckList,
  CourseCurriculum,
  InstructorSpotlight,
  ReviewsSection,
  FAQAccordion,
  StickyEnrollBar,
  LoadingState,
  ErrorState,
} from "./components";
import { SECTION_ICONS } from "./constants";
import "./styles/courseInfo.variables.css";
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

  // ── Sales inquiry — driven by the salesInquiry flag on the course object ──
  // When salesInquiry === true the "I'm Interested" CTA replaces the normal CTA.
  // Free courses (price 0) always go through direct enrolment regardless of flag.
  const isPaidCourse = rawCourse?.salesInquiry === true;
  const isAuth = authService.isAuthenticated();
  const [showSalesModal, setShowSalesModal] = useState(false);
  const { hasInquiry, inquiry, refetchStatus } = useSalesInquiry(courseId, {
    enabled: isPaidCourse && isAuth,
  });

  // Check if user already owns this course (direct enrollment, not subscription)
  const userOwnsCourse = useMemo(() => {
    if (!user || !courseId) return false;
    const userCourses = Array.isArray(user.courses) ? user.courses : [];
    return userCourses.some((entry) => {
      if (typeof entry === "string") return entry === courseId;
      if (typeof entry === "object")
        return (
          entry._id === courseId ||
          entry.id === courseId ||
          entry.courseId === courseId ||
          String(entry) === courseId
        );
      return false;
    });
  }, [user, courseId]);

  // User can access the course if they have a subscription or direct enrollment
  const canUserAccess = isSubscribed || userOwnsCourse;

  // Memoized course with access status
  const courseWithAccess = useMemo(
    () => (isSubscribed ? { ...rawCourse, isSubscribed: true } : rawCourse),
    [rawCourse, isSubscribed],
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

  // Calculate total lessons from chapters
  const totalLessons =
    course.chapters?.reduce(
      (acc, chapter) => acc + (chapter.lessons?.length || 0),
      0,
    ) || course.videosCount;

  return (
    <main className={styles.pageWrapper}>
      {/* Immersive Hero Section */}
      <CourseHero
        headerImage={course.headerImage}
        title={course.title}
        rating={course.rating}
        totalRatings={course.totalRatings}
        courseId={courseId}
        course={courseWithAccess}
        isSubscribed={isSubscribed}
        category={course.category}
        duration={course.duration}
        lessonsCount={totalLessons}
        isPaidCourse={isPaidCourse}
        canUserAccess={canUserAccess}
        hasInquiry={hasInquiry}
        inquiry={inquiry}
        onOpenInquiry={() => setShowSalesModal(true)}
      />

      {/* Course Overview with Animated Stats */}
      <CourseOverview
        videosCount={course.videosCount}
        quizzesCount={course.quizzesCount}
        pdfCount={course.pdfCount}
        duration={course.duration}
        skillLevel={course.skillLevel}
        hasCertificate={course.hasCertificate}
        highlights={course.highlights}
      />

      {/* Course Description Section */}
      <CourseSection
        iconSrc={SECTION_ICONS.description.src}
        iconAlt={SECTION_ICONS.description.alt}
        title="About This Course"
        variant="description"
      >
        <CourseDescription description={course.description} />
      </CourseSection>

      {/* What You'll Learn Section */}
      {course.whatYouWillLearn?.length > 0 && (
        <CourseSection
          iconSrc={SECTION_ICONS.learning.src}
          iconAlt={SECTION_ICONS.learning.alt}
          title="What You'll Learn"
          variant="learning"
        >
          <CheckList items={course.whatYouWillLearn} />
        </CourseSection>
      )}

      {/* Curriculum Accordion (conditional) */}
      <CourseCurriculum
        chapters={course.chapters}
        totalLessons={totalLessons}
        totalDuration={course.duration}
      />

      {/* Target Audience Section */}
      {course.targetAudience?.length > 0 && (
        <CourseSection
          iconSrc={SECTION_ICONS.audience.src}
          iconAlt={SECTION_ICONS.audience.alt}
          title="Who Is This Course For?"
          variant="audience"
        >
          <CheckList items={course.targetAudience} />
        </CourseSection>
      )}

      {/* Instructor Spotlight */}
      <InstructorSpotlight instructor={course.instructor} />

      {/* Student Reviews (conditional) */}
      <ReviewsSection
        reviews={course.reviews}
        averageRating={course.rating}
        totalReviews={course.totalRatings}
        ratingDistribution={course.ratingDistribution}
      />

      {/* FAQ Accordion (conditional) */}
      <FAQAccordion faqs={course.faq} />

      {/* Sticky Enrollment Bar */}
      <StickyEnrollBar
        title={course.title}
        courseId={courseId}
        course={courseWithAccess}
        isSubscribed={isSubscribed}
        isPaidCourse={isPaidCourse}
        canUserAccess={canUserAccess}
        hasInquiry={hasInquiry}
        inquiry={inquiry}
        onOpenInquiry={() => setShowSalesModal(true)}
      />

      {/* Sales Inquiry Modal — paid courses, unauthenticated or no existing inquiry */}
      <SalesInquiryModal
        isOpen={showSalesModal}
        onClose={() => setShowSalesModal(false)}
        courseId={courseId}
        courseTitle={course.title}
        userData={user}
        onSuccess={refetchStatus}
      />
    </main>
  );
};

export default CoursePage;
