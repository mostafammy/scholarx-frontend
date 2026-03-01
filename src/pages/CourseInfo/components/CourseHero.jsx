/**
 * CourseHero Component
 * Immersive hero section with gradient overlay, animations, and premium design
 *
 * Architecture:
 * - Single Responsibility: Hero section with title and CTA
 * - Removes tagline for cleaner design
 * - Glassmorphism effects and micro-animations
 */

import React, { memo, useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import StarRating from "./StarRating";
import EnrollmentButton from "../../../components/EnrollmentButton/EnrollmentButton";
import SalesInquiryCTA from "../../../components/SalesInquiryCTA";
import styles from "./CourseHero.module.css";
import "../styles/courseInfo.variables.css";

/**
 * CourseHero - Immersive hero section for course landing
 */
const CourseHero = ({
  headerImage,
  title,
  rating,
  totalRatings,
  courseId,
  course,
  isSubscribed,
  category,
  duration,
  lessonsCount,
  isPaidCourse,
  canUserAccess,
  hasInquiry,
  inquiry,
  onOpenInquiry,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Entrance animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const courseWithAccess = isSubscribed
    ? { ...course, isSubscribed: true }
    : course;

  const parallaxOffset = Math.min(scrollY * 0.3, 150);

  return (
    <header className={styles.hero}>
      {/* Background Image with Parallax */}
      <div
        className={styles.backgroundImage}
        style={{
          backgroundImage: `url("${headerImage}")`,
          transform: `translateY(${parallaxOffset}px)`,
        }}
        aria-hidden="true"
      />

      {/* Gradient Overlay */}
      <div className={styles.gradientOverlay} aria-hidden="true" />

      {/* Animated Pattern Overlay */}
      <div className={styles.patternOverlay} aria-hidden="true" />

      {/* Main Content */}
      <div className={`${styles.content} ${isVisible ? styles.visible : ""}`}>
        {/* Category Badge */}
        {category && (
          <div className={styles.categoryBadge}>
            <span className={styles.categoryIcon}>📚</span>
            {category}
          </div>
        )}

        {/* Course Title */}
        <h1 className={styles.title}>{title}</h1>

        {/* Quick Stats Row */}
        <div className={styles.quickStats}>
          {duration && (
            <div className={styles.quickStat}>
              <span className={styles.quickStatIcon}>⏱️</span>
              <span>{duration}</span>
            </div>
          )}
          {lessonsCount > 0 && (
            <div className={styles.quickStat}>
              <span className={styles.quickStatIcon}>🎬</span>
              <span>{lessonsCount} lessons</span>
            </div>
          )}
        </div>

        {/* Rating */}
        <div className={styles.ratingWrapper}>
          <StarRating
            rating={rating}
            totalRatings={totalRatings}
            className={styles.rating}
            countClassName={styles.ratingCount}
          />
        </div>

        {/* CTA Button */}
        <div className={styles.ctaWrapper}>
          {isPaidCourse && !canUserAccess ? (
            <SalesInquiryCTA
              hasInquiry={hasInquiry}
              inquiry={inquiry}
              onOpen={onOpenInquiry}
            />
          ) : (
            <EnrollmentButton
              course={courseWithAccess}
              courseId={courseId}
              courseTitle={title}
              openLabel="Start Learning"
              openClassName={styles.ctaButton}
              enrollClassName={styles.ctaButton}
              useDefaultStyles={false}
              hookOptions={{
                isEnrolledOverride: isSubscribed,
              }}
            />
          )}
        </div>

        {/* Scroll Indicator */}
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollArrow}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

CourseHero.propTypes = {
  headerImage: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  rating: PropTypes.number,
  totalRatings: PropTypes.number,
  courseId: PropTypes.string,
  course: PropTypes.object,
  isSubscribed: PropTypes.bool,
  category: PropTypes.string,
  duration: PropTypes.string,
  lessonsCount: PropTypes.number,
  isPaidCourse: PropTypes.bool,
  canUserAccess: PropTypes.bool,
  hasInquiry: PropTypes.bool,
  inquiry: PropTypes.object,
  onOpenInquiry: PropTypes.func,
};

CourseHero.defaultProps = {
  rating: 0,
  totalRatings: 0,
  courseId: null,
  course: null,
  isSubscribed: false,
  category: "",
  duration: "",
  lessonsCount: 0,
  isPaidCourse: false,
  canUserAccess: false,
  hasInquiry: false,
  inquiry: null,
  onOpenInquiry: () => {},
};

export default memo(CourseHero);
