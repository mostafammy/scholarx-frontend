import React, { useMemo } from "react";
import PropTypes from "prop-types";
import "./EnrollmentButton.css";
import useCourseEnrollment from "../../hooks/useCourseEnrollment";

const EnrollmentButton = ({
  course,
  courseId,
  courseTitle,
  openLabel = "Open Course",
  enrollLabel,
  openClassName,
  enrollClassName,
  className = "",
  preventDefault = false,
  onClick,
  hookOptions = {},
  fullWidth = false,
  useDefaultStyles = true,
}) => {
  const {
    isLoading,
    canAccessCourse,
    enrollButtonLabel,
    handleEnroll,
    handleOpenCourse,
  } = useCourseEnrollment(course, {
    courseIdOverride: courseId,
    courseTitleOverride: courseTitle,
    ...hookOptions,
  });

  const resolvedLabel = useMemo(() => {
    if (canAccessCourse) {
      return openLabel;
    }
    return enrollLabel || enrollButtonLabel;
  }, [canAccessCourse, openLabel, enrollLabel, enrollButtonLabel]);

  const resolvedClassName = useMemo(() => {
    const baseClasses = useDefaultStyles
      ? [
          "enrollment-button",
          canAccessCourse
            ? "enrollment-button--open"
            : "enrollment-button--enroll",
          fullWidth ? "enrollment-button--full" : "",
        ]
      : [];

    return [
      ...baseClasses,
      canAccessCourse ? openClassName : enrollClassName,
      className,
    ]
      .filter(Boolean)
      .join(" ");
  }, [
    canAccessCourse,
    className,
    enrollClassName,
    fullWidth,
    openClassName,
    useDefaultStyles,
  ]);

  const handleButtonClick = (event) => {
    if (preventDefault) {
      event?.preventDefault?.();
      event?.stopPropagation?.();
    }

    if (onClick) {
      onClick(event, { canAccessCourse, isLoading });
    }

    if (canAccessCourse) {
      handleOpenCourse();
    } else {
      handleEnroll();
    }
  };

  return (
    <button
      type="button"
      className={resolvedClassName}
      onClick={handleButtonClick}
      disabled={isLoading}
    >
      {resolvedLabel}
    </button>
  );
};

EnrollmentButton.propTypes = {
  course: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
  }),
  courseId: PropTypes.string,
  courseTitle: PropTypes.string,
  openLabel: PropTypes.string,
  enrollLabel: PropTypes.string,
  openClassName: PropTypes.string,
  enrollClassName: PropTypes.string,
  className: PropTypes.string,
  preventDefault: PropTypes.bool,
  onClick: PropTypes.func,
  hookOptions: PropTypes.object,
  fullWidth: PropTypes.bool,
  useDefaultStyles: PropTypes.bool,
};

export default EnrollmentButton;
