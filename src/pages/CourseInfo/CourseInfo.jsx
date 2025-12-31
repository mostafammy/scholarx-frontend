import React, { useEffect, useMemo, useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import courseData from "./CourseData";
import "./CourseInfo.css";
import { useUser } from "../../context/UserContext";
import BlockedUserMessage from "../../components/BlockedUserMessage/BlockedUserMessage";
import {
  fetchCourseDetails,
  clearCurrentCourse,
} from "../../store/slices/courseSlice";
import EnrollmentButton from "../../components/EnrollmentButton/EnrollmentButton";
import api from "../../services/api";

function CoursePage() {
  const { courseId } = useParams();
  const { user } = useUser();
  const dispatch = useDispatch();
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    loading: false,
    isSubscribed: false,
  });
  const courseState = useSelector((state) => state?.course) || {};
  const {
    currentCourse,
    loading: courseStateLoading,
    error: courseStateError,
  } = courseState;

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseDetails(courseId));
    }
    return () => {
      dispatch(clearCurrentCourse());
    };
  }, [dispatch, courseId]);

  useEffect(() => {
    let isMounted = true;

    const fetchSubscription = async () => {
      if (!user?._id || !courseId) {
        setSubscriptionStatus((prev) => ({ ...prev, isSubscribed: false }));
        return;
      }

      try {
        setSubscriptionStatus((prev) => ({ ...prev, loading: true }));
        const response = await api.get(
          `/courses/${courseId}/subscription-status`,
          {
            params: { userId: user._id },
          }
        );

        if (!isMounted) return;
        setSubscriptionStatus({
          loading: false,
          isSubscribed: Boolean(response.data?.data?.isSubscribed),
        });
      } catch (error) {
        if (!isMounted) return;
        setSubscriptionStatus({ loading: false, isSubscribed: false });
      }
    };

    fetchSubscription();

    return () => {
      isMounted = false;
    };
  }, [user?._id, courseId]);

  const course = currentCourse || courseData;
  const courseWithAccess = useMemo(() => {
    if (subscriptionStatus.isSubscribed) {
      return { ...course, isSubscribed: true };
    }
    return course;
  }, [course, subscriptionStatus.isSubscribed]);
  const headerImage =
    course.headerImage ||
    course.bannerImage ||
    course.coverImage ||
    courseData.headerImage;
  const courseTitle = course.title || courseData.title;
  const courseTagline = course.tagline || course.subtitle || courseData.tagline;
  const ratingValue = Number(course.rating ?? courseData.rating ?? 0);
  const totalRatings =
    course.totalRatings ||
    course.reviewsCount ||
    course.reviewCount ||
    courseData.totalRatings;
  const videosCount =
    course.totalLessons ||
    course.videosCount ||
    course.lessonsCount ||
    courseData.videosCount;
  const quizzesCount =
    course.quizzesCount || course.assessmentsCount || courseData.quizzesCount;
  const pdfCount =
    course.pdfCount || course.resourcesCount || courseData.pdfCount;
  const description =
    course.description || course.longDescription || courseData.description;
  const learningListRaw =
    course.whatYouWillLearn ||
    course.WhatYouWillLearn ||
    course.learningObjectives ||
    course.objectives ||
    courseData.WhatYouWillLearn;
  const targetAudienceRaw =
    course.targetAudience ||
    course.whoIsThisFor ||
    course.audience ||
    courseData.targetAudience;
  const learningList = Array.isArray(learningListRaw)
    ? learningListRaw
    : courseData.WhatYouWillLearn;
  const targetAudience = Array.isArray(targetAudienceRaw)
    ? targetAudienceRaw
    : courseData.targetAudience;
  const ratingCountLabel = totalRatings ? `(${totalRatings})` : null;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="star" />);
      } else if (i - rating < 1) {
        stars.push(<FaStar key={i} className="star half" />);
      } else {
        stars.push(<FaRegStar key={i} className="star" />);
      }
    }
    return stars;
  };

  const showLoadingState = courseStateLoading && !currentCourse;

  // Check if user is blocked and show blocked message
  if (user && user.isBlocked) {
    return (
      <BlockedUserMessage
        blockReason={user.blockReason}
        blockedAt={user.blockedAt}
      />
    );
  }

  if (showLoadingState) {
    return <div className="course-loading">Loading course details...</div>;
  }

  if (courseStateError && !currentCourse) {
    return <div className="course-error">{courseStateError}</div>;
  }

  return (
    <>
      <div className="course-container">
        <div
          className="course-header"
          style={{
            backgroundImage: `url("${headerImage}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "570px",
            position: "relative",
          }}
        >
          <img src="/Grouplogo.png" alt="Overlay" className="overlay-image" />
          <div className="overlaytext">
            <h1 className="course-title">{courseTitle}</h1>
            <p className="course-tagline">{courseTagline}</p>

            <div className="course-rating">
              {renderStars(ratingValue)}
              {ratingCountLabel && (
                <span className="rating-count">{ratingCountLabel}</span>
              )}
            </div>

            <EnrollmentButton
              course={courseWithAccess}
              courseId={courseId}
              courseTitle={courseTitle}
              openLabel="Open Course"
              openClassName="enroll-button"
              enrollClassName="enroll-button"
              useDefaultStyles={false}
              hookOptions={{
                isEnrolledOverride: subscriptionStatus.isSubscribed,
              }}
            />
          </div>
          <div className="course-stats">
            <div className="stat-item">
              <img src="/video-play.png" alt="Videos" className="stat-icon" />

              <div className="stat-info">
                <span className="stat-number">{videosCount}</span>
                <span className="stat-label">Videos</span>
              </div>
            </div>
            <div className="stat-item">
              <img
                src="/document-copy.png"
                alt="Quizzes"
                className="stat-icon"
              />
              <div className="stat-info">
                <span className="stat-number">{quizzesCount}</span>
                <span className="stat-label">Quizzes</span>
              </div>
            </div>
            <div className="stat-item">
              <img src="/edit.png" alt="PDFs" className="stat-icon" />
              <div className="stat-info">
                <span className="stat-number">{pdfCount}</span>
                <span className="stat-label">PDFs</span>
              </div>
            </div>
          </div>
        </div>

        <div className="course-section course-description-section">
          <div className="section-header">
            <img
              src="/course-description.png"
              alt="Course Icon"
              className="section-icon"
            />
            <h2 className="section-title">Course Description</h2>
          </div>
          <p className="course-description">{description}</p>
        </div>

        <div className="course-section">
          <div className="section-header">
            <img src="/learn.png" alt="Learn Icon" className="section-icon" />
            <h2 className="section-title">What You'll Learn</h2>
          </div>
          <ul className="learning-list">
            {learningList &&
              learningList.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </div>

        <div className="course-section">
          <div className="section-header">
            <img src="/target.png" alt="Target Icon" className="section-icon" />
            <h2 className="section-title">Target Audience</h2>
          </div>
          <ul className="audience-list">
            {targetAudience &&
              targetAudience.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </div>
      </div>
    </>
  );
}

export default CoursePage;
