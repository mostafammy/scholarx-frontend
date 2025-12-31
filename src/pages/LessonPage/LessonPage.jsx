import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import "./LessonPage.css";
import { useDispatch, useSelector } from "react-redux";
import BlockedUserMessage from "../../components/BlockedUserMessage/BlockedUserMessage";
import { courseService } from "../../services/api";
import CertificateModal from "../../components/CertificateModal/CertificateModal";
import SecureVideoPlayer from "../../components/SecureVideoPlayer/SecureVideoPlayer";

import {
  fetchCourseLessons,
  checkCourseSubscription,
} from "../../store/slices/lessonSlice";
import {
  markLessonComplete as markLessonCompleteCertificate,
  getCompletedLessons,
  getCourseCompletionStatus,
} from "../../store/slices/certificateSlice";

const LessonPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, loading: userLoading } = useUser();
  const [currentLesson, setCurrentLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  // Restore lessons state from Redux
  const {
    sections,
    currentLesson: reduxCurrentLesson,
    completedLessons: reduxCompletedLessons,
    course,
    isSubscribed,
    isBlocked,
    loading: reduxLoading,
    error: reduxError,
  } = useSelector((state) => state.lessons);

  // Get certificate state
  const {
    completedLessons: certificateCompletedLessons,
    courseCompletionStatus,
    completedCourses,
  } = useSelector((state) => state.certificates);
  const [showCompletionNotification, setShowCompletionNotification] =
    useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const playbackMetricsRef = useRef({ currentTime: 0, duration: 0 });
  const notificationTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  // Fetch course data and check subscription using Redux
  useEffect(() => {
    if (!userLoading && courseId) {
      setLoading(true);
      dispatch(fetchCourseLessons(courseId))
        .then((result) => {
          if (
            result.payload &&
            result.payload.sections &&
            result.payload.sections.length > 0
          ) {
            setCurrentLesson(result.payload.sections[0].lessons[0]);
          }
        })
        .catch((error) => {
          setError(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [dispatch, courseId, userLoading]);

  // Check subscription status
  useEffect(() => {
    if (user && courseId) {
      dispatch(checkCourseSubscription({ courseId, userId: user._id }));
      // Fetch completed lessons and course completion status
      dispatch(getCompletedLessons(courseId));
      dispatch(getCourseCompletionStatus(courseId));
    }
  }, [dispatch, courseId, user]);

  // Force refresh completion data when current lesson changes
  useEffect(() => {
    if (courseId && currentLesson) {
      dispatch(getCompletedLessons(courseId));
      dispatch(getCourseCompletionStatus(courseId));
    }
  }, [dispatch, courseId, currentLesson]);

  const isFreeCourse = courseService.isFreeCourse(course);

  // Progress calculation - combine local state and Redux state for real-time updates
  const totalLessons = sections.reduce(
    (acc, sec) => acc + sec.lessons.length,
    0
  );
  const certificateCompleted = certificateCompletedLessons[courseId] || [];

  // Combine Redux state with local state for immediate UI updates
  const allCompletedLessons = [
    ...new Set([...certificateCompleted, ...completedLessons]),
  ];
  const completedCount = allCompletedLessons.length;
  const progress = totalLessons ? (completedCount / totalLessons) * 100 : 0;

  // Check if course is completed
  const isCourseCompleted = completedCount >= totalLessons && totalLessons > 0;
  const courseCompletion = completedCourses.find(
    (cc) => cc.course._id === courseId
  );

  // Calculate current lesson number
  const getCurrentLessonNumber = () => {
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
  };
  const handleLessonComplete = useCallback(() => {
    if (!currentLesson || !courseId) {
      return;
    }

    const { duration } = playbackMetricsRef.current;

    dispatch(
      markLessonCompleteCertificate({
        lessonId: currentLesson._id,
        courseId,
        watchTime: duration,
        completionPercentage: 100,
      })
    ).then(() => {
      dispatch(getCompletedLessons(courseId));
      dispatch(getCourseCompletionStatus(courseId));
    });

    setCompletedLessons((prev) => {
      if (!prev.includes(currentLesson._id)) {
        return [...prev, currentLesson._id];
      }
      return prev;
    });

    setShowCompletionNotification(true);
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    notificationTimeoutRef.current = setTimeout(
      () => setShowCompletionNotification(false),
      5000
    );
  }, [dispatch, currentLesson, courseId]);

  const handlePlaybackProgress = useCallback(
    ({ currentTime = 0, duration = 0 }) => {
      playbackMetricsRef.current = { currentTime, duration };
    },
    []
  );

  const handleCertificateModalOpen = useCallback(() => {
    if (!courseCompletion || !user || !course) {
      return;
    }

    setCertificateData({
      studentName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      courseName: course.title,
      completedAt: courseCompletion.completedAt,
      certificateId: courseCompletion.certificateId,
      completionPercentage: courseCompletion.completionPercentage,
    });
    setShowCertificateModal(true);
  }, [courseCompletion, course, user]);

  const handleCertificateModalClose = useCallback(() => {
    setShowCertificateModal(false);
    setCertificateData(null);
  }, []);

  if (loading || userLoading || reduxLoading)
    return <div className="loading">Loading...</div>;

  if (error || reduxError)
    return <div className="error">{error || reduxError}</div>;

  if (user && user.isBlocked) {
    return (
      <BlockedUserMessage
        blockReason={user?.blockReason}
        blockedAt={user?.blockedAt}
      />
    );
  }

  if (!isSubscribed && !isFreeCourse) {
    return (
      <div className="subscription-required">
        <h2>Subscription Required</h2>
        <p>You need to subscribe to this course to access its lessons.</p>
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/courses/${courseId}`)}
        >
          View Course Details
        </button>
      </div>
    );
  }

  // --- Render ---
  return (
    <div className="lesson-main-layout">
      <div className="lesson-left">
        <div className="lesson-video-container">
          <SecureVideoPlayer
            videoUrl={currentLesson?.videoUrl}
            onComplete={handleLessonComplete}
            onProgress={handlePlaybackProgress}
          />
        </div>
        <div className="lesson-title text-center">
          {course?.title || "Course"}
          {currentLesson && (
            <div className="lesson-subtitle">
              {currentLesson.title} ({getCurrentLessonNumber()}/{totalLessons})
            </div>
          )}

          {/* Course Completion Certificate Section */}
          {isCourseCompleted && (
            <div className="course-completion-celebration">
              <div className="celebration-icon">🎉</div>
              <h3 className="celebration-title">Congratulations!</h3>
              <p className="celebration-message">
                You have successfully completed all lessons in this course!
              </p>
              <div className="celebration-actions">
                <button
                  className="view-certificate-btn"
                  onClick={() => navigate("/certificates")}
                >
                  🏆 View Certificate
                </button>
                <button
                  className="view-certificate-modal-btn"
                  onClick={handleCertificateModalOpen}
                  disabled={!courseCompletion}
                >
                  📜 View Certificate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="lesson-right">
        <div className="lesson-sections-card">
          <div className="lesson-sections-title">
            Course Sections
            {isCourseCompleted && (
              <span className="completed-badge">✅ Completed</span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="progress-section">
            <div className="progress-header">
              <span className="progress-label">Course Progress</span>
              <span className="progress-count">
                {completedCount}/{totalLessons} lessons
              </span>
            </div>
            <div className="progress-bar-container">
              <div
                className={`progress-bar-fill ${
                  isCourseCompleted ? "completed" : "in-progress"
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="progress-percentage">
              {Math.round(progress)}% Complete
            </div>
          </div>
          <div className="lesson-sections-list">
            {sections.map((section, sIdx) => (
              <div className="lesson-section" key={section.title}>
                <div className="lesson-section-title">
                  {section.index}- {section.title}
                </div>
                <div className="lesson-section-lessons">
                  {section.lessons.map((lesson, lIdx) => (
                    <div
                      key={lesson._id}
                      className={`lesson-section-lesson${
                        currentLesson && lesson._id === currentLesson._id
                          ? " active"
                          : ""
                      }`}
                      onClick={() => {
                        setCurrentLesson(lesson);
                      }}
                    >
                      <span className="lesson-checkmark">
                        {allCompletedLessons.includes(lesson._id) ? "✔️" : ""}
                      </span>
                      <span className="lesson-section-lesson-title">
                        {lesson.title}
                      </span>
                      <span className="lesson-section-lesson-duration">
                        {lesson.duration ? lesson.duration.toFixed(2) : "00:00"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lesson Completion Notification */}
      {showCompletionNotification && (
        <div className="completion-notification">
          <div className="notification-icon">✅</div>
          <div className="notification-content">
            <div className="notification-title">Lesson Completed!</div>
            <div className="notification-message">
              {completedCount}/{totalLessons} lessons completed
              {completedCount >= totalLessons && (
                <div className="course-complete-message">
                  🎉 Course Complete! Check your certificate!
                </div>
              )}
            </div>
          </div>
          <button
            className="notification-close-btn"
            onClick={() => setShowCompletionNotification(false)}
          >
            ✕
          </button>
        </div>
      )}
      <CertificateModal
        isOpen={showCertificateModal}
        onClose={handleCertificateModalClose}
        certificateData={certificateData}
      />
    </div>
  );
};

export default LessonPage;
