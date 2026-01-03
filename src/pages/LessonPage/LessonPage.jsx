/**
 * LessonPage Component
 * Main lesson viewing page - Refactored following SOLID Principles
 *
 * Architecture:
 * - Single Responsibility: Each component handles one concern
 * - Open/Closed: Components extensible through props
 * - Liskov Substitution: Components can be substituted with similar interfaces
 * - Interface Segregation: Props are specific to each component's needs
 * - Dependency Inversion: Business logic abstracted to custom hooks
 */

import React, { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import BlockedUserMessage from "../../components/BlockedUserMessage/BlockedUserMessage";
import CertificateModal from "../../components/CertificateModal/CertificateModal";

import {
  useLessonData,
  useLessonCompletion,
  useCertificateModal,
} from "./hooks";
import {
  VideoPlayer,
  LessonHeader,
  CourseSidebar,
  CompletionCelebration,
  CompletionNotification,
  AccessDenied,
  LoadingState,
  EmptyLessonState,
} from "./components";
import styles from "./LessonPage.module.css";

/**
 * LessonPage - Main container component
 * Orchestrates data fetching and component composition
 */
const LessonPage = () => {
  const { courseId } = useParams();
  const { user, loading: userLoading } = useUser();

  // Custom hooks for data and state management
  const {
    sections,
    course,
    currentLesson,
    loading,
    error,
    isBlocked,
    isFreeCourse,
    hasCourseAccess,
    totalLessons,
    completedCount,
    progress,
    allCompletedLessons,
    isCourseCompleted,
    courseCompletion,
    selectLesson,
    addCompletedLesson,
    getCurrentLessonNumber,
  } = useLessonData(courseId, user, userLoading);

  // Lesson completion handling
  const {
    showNotification,
    handleLessonComplete: onLessonComplete,
    handlePlaybackProgress,
    dismissNotification,
  } = useLessonCompletion(courseId, user, addCompletedLesson);

  // Certificate modal handling
  const {
    isOpen: showCertificateModal,
    certificateData,
    openModal: handleCertificateModalOpen,
    closeModal: handleCertificateModalClose,
  } = useCertificateModal(courseCompletion, course, user);

  // Handle video completion
  const handleVideoComplete = useCallback(() => {
    if (currentLesson) {
      onLessonComplete(currentLesson._id);
    }
  }, [currentLesson, onLessonComplete]);

  // Loading state
  if (loading || userLoading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorCard}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2 className={styles.errorTitle}>Something went wrong</h2>
          <p className={styles.errorMessage}>{error}</p>
          <button
            className={styles.retryBtn}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Blocked user
  if (user && isBlocked) {
    return (
      <BlockedUserMessage
        blockReason={user?.blockReason}
        blockedAt={user?.blockedAt}
      />
    );
  }

  // Login required
  if (!user && !userLoading) {
    return <AccessDenied type="login" courseId={courseId} />;
  }

  // Access checks
  if (!hasCourseAccess) {
    if (isFreeCourse) {
      return <AccessDenied type="enrollment" courseId={courseId} />;
    }
    return <AccessDenied type="subscription" courseId={courseId} />;
  }

  return (
    <div className={styles.page}>
      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* Video Player or Empty State */}
        {currentLesson ? (
          <VideoPlayer
            videoUrl={currentLesson.videoUrl}
            onComplete={handleVideoComplete}
            onProgress={handlePlaybackProgress}
            lessonTitle={currentLesson.title}
          />
        ) : (
          <EmptyLessonState courseName={course?.title} />
        )}

        {/* Lesson Header - only show when lesson selected */}
        {currentLesson && (
          <LessonHeader
            courseTitle={course?.title}
            lessonTitle={currentLesson?.title}
            currentLessonNumber={getCurrentLessonNumber()}
            totalLessons={totalLessons}
          />
        )}

        {/* Course Completion Celebration */}
        {isCourseCompleted && (
          <CompletionCelebration
            onViewCertificate={handleCertificateModalOpen}
            hasCertificate={Boolean(courseCompletion)}
          />
        )}
      </main>

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <CourseSidebar
          sections={sections}
          currentLessonId={currentLesson?._id}
          completedLessons={allCompletedLessons}
          progress={progress}
          completedCount={completedCount}
          totalLessons={totalLessons}
          isCourseCompleted={isCourseCompleted}
          onLessonSelect={selectLesson}
        />
      </aside>

      {/* Completion Notification */}
      <CompletionNotification
        isVisible={showNotification}
        completedCount={completedCount}
        totalLessons={totalLessons}
        isCourseComplete={isCourseCompleted}
        onDismiss={dismissNotification}
      />

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={showCertificateModal}
        onClose={handleCertificateModalClose}
        certificateData={certificateData}
      />
    </div>
  );
};

export default LessonPage;
