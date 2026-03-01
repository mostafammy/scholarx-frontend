/**
 * StickyEnrollBar Component
 * Persistent call-to-action bar that appears on scroll
 *
 * Architecture:
 * - Single Responsibility: Sticky CTA only
 * - Smooth slide in/out animation
 * - Mobile-optimized sticky footer
 */

import React, { memo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import EnrollmentButton from "../../../components/EnrollmentButton/EnrollmentButton";
import SalesInquiryCTA from "../../../components/SalesInquiryCTA";
import styles from "./StickyEnrollBar.module.css";

/**
 * StickyEnrollBar - Persistent enrollment CTA
 */
const StickyEnrollBar = ({
  title,
  courseId,
  course,
  isSubscribed,
  scrollThreshold = 500,
  isPaidCourse,
  canUserAccess,
  hasInquiry,
  inquiry,
  onOpenInquiry,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > scrollThreshold;
      setIsVisible(shouldShow);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollThreshold]);

  const courseWithAccess = isSubscribed
    ? { ...course, isSubscribed: true }
    : course;

  // Truncate title for mobile
  const displayTitle = title?.length > 40 ? `${title.slice(0, 40)}...` : title;

  return (
    <div className={`${styles.stickyBar} ${isVisible ? styles.visible : ""}`}>
      <div className={styles.container}>
        <div className={styles.titleSection}>
          <span className={styles.title}>{displayTitle}</span>
        </div>

        <div className={styles.ctaSection}>
          {isPaidCourse && !canUserAccess ? (
            <SalesInquiryCTA
              hasInquiry={hasInquiry}
              inquiry={inquiry}
              onOpen={onOpenInquiry}
              compact
              onLight
            />
          ) : (
            <EnrollmentButton
              course={courseWithAccess}
              courseId={courseId}
              courseTitle={title}
              openLabel={isSubscribed ? "Continue" : "Enroll Now"}
              openClassName={styles.ctaButton}
              enrollClassName={styles.ctaButton}
              useDefaultStyles={false}
              hookOptions={{
                isEnrolledOverride: isSubscribed,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

StickyEnrollBar.propTypes = {
  title: PropTypes.string.isRequired,
  courseId: PropTypes.string,
  course: PropTypes.object,
  isSubscribed: PropTypes.bool,
  scrollThreshold: PropTypes.number,
  isPaidCourse: PropTypes.bool,
  canUserAccess: PropTypes.bool,
  hasInquiry: PropTypes.bool,
  inquiry: PropTypes.object,
  onOpenInquiry: PropTypes.func,
};

StickyEnrollBar.defaultProps = {
  courseId: null,
  course: null,
  isSubscribed: false,
  scrollThreshold: 500,
  isPaidCourse: false,
  canUserAccess: false,
  hasInquiry: false,
  inquiry: null,
  onOpenInquiry: () => {},
};

export default memo(StickyEnrollBar);
