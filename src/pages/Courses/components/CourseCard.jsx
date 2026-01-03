/**
 * CourseCard Component
 * Main course card with micro-animations
 * Following Single Responsibility and Composition Principles
 */

import React, { memo, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";

import { getCourseImageUrl } from "../../../utils/imageUtils";
import EnrollmentButton from "../../../components/EnrollmentButton/EnrollmentButton";
import CourseBadge from "./CourseBadge";
import CourseMetaBadge from "./CourseMetaBadge";
import CourseRating from "./CourseRating";
import CoursePrice from "./CoursePrice";
import InstructorInfo from "./InstructorInfo";
import CourseCardSkeleton from "./CourseCardSkeleton";
import { NEW_COURSE_THRESHOLD_DAYS, SKELETON_DISPLAY_TIME } from "../constants";
import defaultCourseImg from "../../../assets/Images/image.png";
import styles from "./CourseCard.module.css";

/**
 * Determines if a course is new based on creation date
 */
const isNewCourse = (createdAt) => {
  if (!createdAt) return false;
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffDays = (now - createdDate) / (1000 * 60 * 60 * 24);
  return diffDays <= NEW_COURSE_THRESHOLD_DAYS;
};

/**
 * Gets appropriate badge configuration
 */
const getBadgeConfig = (course, section) => {
  const isNew = isNewCourse(course.createdAt);

  if (section === "latest" && isNew) {
    return { label: "New", variant: "new" };
  }
  if (section === "featured") {
    return { label: "Featured", variant: "featured" };
  }
  if (section === "scholarx") {
    return { label: "ScholarX", variant: "scholarx" };
  }
  if (course.category) {
    return { label: course.category, variant: "category" };
  }
  return null;
};

const CourseCard = ({ course, section, index, className }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Simulate initial data loading with staggered animation
  useEffect(() => {
    const delay = SKELETON_DISPLAY_TIME + (index || 0) * 100;
    const timer = setTimeout(() => setIsLoading(false), delay);
    return () => clearTimeout(timer);
  }, [index]);

  // Memoized course data extraction
  const courseData = useMemo(
    () => ({
      id: course._id,
      title: course.title || "Course Title",
      hours: course.totalDuration || 0,
      lectures: course.totalLessons || 0,
      price: course.currentPrice || 0,
      oldPrice: course.oldPrice || 0,
      instructor: course.instructor?.name || "Instructor",
      instructorAvatar: course.instructor?.profilePicture,
      reviews: course.reviews || 0,
      rating: course.rating || 0,
      image: getCourseImageUrl(course, defaultCourseImg),
    }),
    [course]
  );

  const badgeConfig = useMemo(
    () => getBadgeConfig(course, section),
    [course, section]
  );

  if (isLoading) {
    return <CourseCardSkeleton className={className} />;
  }

  return (
    <Link
      to={`/CoursePage/${courseData.id}`}
      className={`${styles.cardLink} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article
        className={`${styles.card} ${isHovered ? styles.cardHovered : ""}`}
        style={{ "--animation-delay": `${(index || 0) * 0.1}s` }}
      >
        {/* Image Section */}
        <div className={styles.imageWrapper}>
          <img
            src={courseData.image}
            alt={courseData.title}
            className={styles.image}
            loading="lazy"
          />
          {badgeConfig && (
            <CourseBadge
              label={badgeConfig.label}
              variant={badgeConfig.variant}
              className={styles.badge}
            />
          )}
          <div className={styles.imageOverlay} />
        </div>

        {/* Content Section */}
        <div className={styles.body}>
          {/* Meta badges */}
          <div className={styles.metaRow}>
            <CourseMetaBadge
              type="duration"
              value={courseData.hours}
              label="Hour"
            />
            <CourseMetaBadge
              type="lectures"
              value={courseData.lectures}
              label="Lectures"
            />
            {courseData.price > 0 && (
              <CourseMetaBadge type="paid" value="Paid" />
            )}
          </div>

          {/* Title */}
          <h3 className={styles.title}>{courseData.title}</h3>

          {/* Action row */}
          <div className={styles.actionRow}>
            <EnrollmentButton
              course={course}
              courseId={courseData.id}
              courseTitle={courseData.title}
              openLabel="Open Course"
              openClassName={styles.buttonOpen}
              enrollClassName={styles.buttonEnroll}
              preventDefault
              useDefaultStyles={false}
            />
            <CoursePrice
              price={courseData.price}
              oldPrice={courseData.oldPrice}
            />
          </div>

          {/* Rating */}
          <CourseRating
            rating={courseData.rating}
            reviewCount={courseData.reviews}
            className={styles.rating}
          />

          {/* Footer */}
          <div className={styles.footer}>
            <InstructorInfo
              name={courseData.instructor}
              avatar={courseData.instructorAvatar}
            />
            <span className={styles.detailsLink}>
              Details <FaChevronRight className={styles.chevron} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

CourseCard.propTypes = {
  /** Course data object */
  course: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    totalDuration: PropTypes.number,
    totalLessons: PropTypes.number,
    currentPrice: PropTypes.number,
    oldPrice: PropTypes.number,
    instructor: PropTypes.shape({
      name: PropTypes.string,
      profilePicture: PropTypes.string,
    }),
    reviews: PropTypes.number,
    rating: PropTypes.number,
    category: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
  /** Section type for badge styling */
  section: PropTypes.oneOf(["latest", "featured", "scholarx", "search"]),
  /** Card index for staggered animations */
  index: PropTypes.number,
  /** Additional CSS class */
  className: PropTypes.string,
};

CourseCard.defaultProps = {
  section: "latest",
  index: 0,
  className: "",
};

export default memo(CourseCard);
