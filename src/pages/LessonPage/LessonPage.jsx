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
 *
 * Enhanced UX Features:
 * - Navigation bar with back button and lesson navigation
 * - Keyboard shortcuts for power users
 * - Auto-play next lesson with countdown
 * - Lesson notes for note-taking
 * - Theater mode for immersive viewing
 * - Quick actions bar with common features
 * - Mini progress timeline
 * - Lesson description with tabs
 */

import React, { useCallback, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import BlockedUserMessage from "../../components/BlockedUserMessage/BlockedUserMessage";
import CertificateModal from "../../components/CertificateModal/CertificateModal";

import {
  useLessonData,
  useLessonCompletion,
  useCertificateModal,
  useLessonNavigation,
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
  LessonContentWrapper,
  NavigationBar,
  AutoPlayOverlay,
  LessonNotes,
  QuickActions,
  MiniProgress,
  LessonDescription,
  KeyboardShortcuts,
} from "./components";
import styles from "./LessonPage.module.css";

/**
 * LessonPage - Main container component
 * Orchestrates data fetching and component composition
 */
const LessonPage = () => {
  const { courseId } = useParams();
  const { user, loading: userLoading } = useUser();

  // Local state for UI features
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

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

  // Lesson navigation hook
  const {
    isTheaterMode,
    showAutoPlay,
    isSidebarVisible,
    playbackSpeed,
    hasPrevious,
    hasNext,
    nextLesson,
    goToPreviousLesson,
    goToNextLesson,
    toggleTheaterMode,
    toggleSidebar,
    triggerAutoPlay,
    cancelAutoPlay,
    changePlaybackSpeed,
  } = useLessonNavigation(sections, currentLesson, selectLesson);

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

  // Handle video completion - triggers auto-play
  const handleVideoComplete = useCallback(() => {
    if (currentLesson) {
      onLessonComplete(currentLesson._id);
      // Trigger auto-play for next lesson
      if (hasNext) {
        triggerAutoPlay();
      }
    }
  }, [currentLesson, onLessonComplete, hasNext, triggerAutoPlay]);

  // Handle manual lesson completion
  const handleMarkComplete = useCallback(() => {
    if (currentLesson && !allCompletedLessons.includes(currentLesson._id)) {
      onLessonComplete(currentLesson._id);
    }
  }, [currentLesson, allCompletedLessons, onLessonComplete]);

  // Toggle notes panel
  const handleToggleNotes = useCallback(() => {
    setIsNotesExpanded((prev) => !prev);
  }, []);

  // Toggle keyboard shortcuts help
  const handleToggleKeyboardHelp = useCallback(() => {
    setShowKeyboardHelp((prev) => !prev);
  }, []);

  // Keyboard shortcut for help (? key)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        return;
      }
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setShowKeyboardHelp(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  // Check if current lesson is completed
  const isCurrentLessonCompleted = currentLesson
    ? allCompletedLessons.includes(currentLesson._id)
    : false;

  return (
    <div
      className={`${styles.page} ${isTheaterMode ? styles.theaterMode : ""}`}
    >
      {/* Navigation Bar - Always visible at top */}
      <NavigationBar
        courseId={courseId}
        courseTitle={course?.title}
        currentLessonNumber={getCurrentLessonNumber()}
        totalLessons={totalLessons}
        onPreviousLesson={goToPreviousLesson}
        onNextLesson={goToNextLesson}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        isTheaterMode={isTheaterMode}
        onToggleTheaterMode={toggleTheaterMode}
      />

      {/* Main Layout Container */}
      <div className={styles.layoutContainer}>
        {/* Main Content Area */}
        <main
          className={`${styles.mainContent} ${
            !isSidebarVisible ? styles.fullWidth : ""
          }`}
        >
          {/* Video Player or Empty State - Wrapped for consistent sizing */}
          <LessonContentWrapper isTheaterMode={isTheaterMode}>
            {currentLesson ? (
              <VideoPlayer
                videoUrl={currentLesson.videoUrl}
                onComplete={handleVideoComplete}
                onProgress={handlePlaybackProgress}
                onSpeedChange={changePlaybackSpeed}
                lessonTitle={currentLesson.title}
                playbackSpeed={playbackSpeed}
              />
            ) : (
              <EmptyLessonState courseName={course?.title} />
            )}
          </LessonContentWrapper>

          {/* Mini Progress Timeline - Below video */}
          {!isTheaterMode && currentLesson && (
            <MiniProgress
              sections={sections}
              currentLessonId={currentLesson?._id}
              completedLessons={allCompletedLessons}
              onLessonSelect={selectLesson}
              totalLessons={totalLessons}
              completedCount={completedCount}
            />
          )}

          {/* Lesson Header - only show when lesson selected */}
          {currentLesson && !isTheaterMode && (
            <LessonHeader
              courseTitle={course?.title}
              lessonTitle={currentLesson?.title}
              currentLessonNumber={getCurrentLessonNumber()}
              totalLessons={totalLessons}
            />
          )}

          {/* Lesson Description Tabs */}
          {currentLesson && !isTheaterMode && (
            <LessonDescription
              lesson={currentLesson}
              courseTitle={course?.title}
            />
          )}

          {/* Lesson Notes */}
          {currentLesson && !isTheaterMode && (
            <LessonNotes
              lessonId={currentLesson._id}
              courseId={courseId}
              isExpanded={isNotesExpanded}
              onToggle={handleToggleNotes}
            />
          )}

          {/* Course Completion Celebration */}
          {isCourseCompleted && !isTheaterMode && (
            <CompletionCelebration
              onViewCertificate={handleCertificateModalOpen}
              hasCertificate={Boolean(courseCompletion)}
            />
          )}
        </main>

        {/* Sidebar - Collapsible */}
        {isSidebarVisible && !isTheaterMode && (
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
        )}
      </div>

      {/* Quick Actions Bar - Fixed at bottom */}
      {currentLesson && (
        <QuickActions
          isLessonCompleted={isCurrentLessonCompleted}
          onMarkComplete={handleMarkComplete}
          onToggleNotes={handleToggleNotes}
          onToggleSidebar={toggleSidebar}
          isSidebarVisible={isSidebarVisible}
          isNotesExpanded={isNotesExpanded}
          playbackSpeed={playbackSpeed}
          onSpeedChange={changePlaybackSpeed}
        />
      )}

      {/* Auto-Play Overlay */}
      <AutoPlayOverlay
        isVisible={showAutoPlay}
        nextLesson={nextLesson}
        onPlayNext={goToNextLesson}
        onCancel={cancelAutoPlay}
      />

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

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcuts
        isVisible={showKeyboardHelp}
        onClose={handleToggleKeyboardHelp}
      />
    </div>
  );
};

export default LessonPage;
