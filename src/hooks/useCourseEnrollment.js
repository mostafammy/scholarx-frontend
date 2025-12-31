import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import api, { authService, courseService } from "../services/api";
import { useUser } from "../context/UserContext";

const DEFAULT_COURSE_TITLE = "Course";

const resolveCourseTitle = (course, fallbackTitle) =>
  course?.title || course?.name || fallbackTitle || DEFAULT_COURSE_TITLE;

const formatErrorMessage = (error) =>
  error?.message ||
  error?.response?.data?.message ||
  "Something went wrong. Please try again later.";

export const useCourseEnrollment = (course, options = {}) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [hasJustEnrolled, setHasJustEnrolled] = useState(false);

  const courseId = course?._id || options.courseIdOverride;
  const courseTitle = resolveCourseTitle(course, options.courseTitleOverride);
  const isFreeCourse = useMemo(
    () => courseService.isFreeCourse(course),
    [course]
  );
  const isSubscribed = Boolean(course?.isSubscribed);

  const userOwnsCourse = useMemo(() => {
    if (!user || !courseId) {
      return false;
    }

    const normalizeId = (value) => {
      if (!value) return null;
      if (typeof value === "string" || typeof value === "number") {
        return String(value);
      }
      if (typeof value === "object") {
        return (
          value._id ||
          value.id ||
          value.courseId ||
          value.course?._id ||
          (typeof value.toString === "function" ? value.toString() : null)
        );
      }
      return null;
    };

    const normalizedCourseId = String(courseId);
    const userCourses = Array.isArray(user.courses) ? user.courses : [];
    return userCourses.some((entry) => normalizeId(entry) === normalizedCourseId);
  }, [user, courseId]);

  const externalAccessFlag = Boolean(
    options.initialAccess ?? options.isEnrolledOverride ?? false
  );

  const canAccessCourse = Boolean(
    isSubscribed || userOwnsCourse || externalAccessFlag || hasJustEnrolled
  );

  const navigateToLessons = useCallback(() => {
    if (!courseId) return;
    navigate(`/course/${courseId}/lessons`);
    options.onNavigateToLessons?.();
  }, [courseId, navigate, options]);

  const showAlreadyEnrolledAlert = useCallback(async () => {
    await Swal.fire({
      icon: "info",
      title: "Already Enrolled",
      text: "You already have access to this course.",
      confirmButtonText: "Go to Lessons",
    });
    setHasJustEnrolled(true);
    navigateToLessons();
  }, [navigateToLessons]);

  const handleContactAdmin = useCallback(async () => {
    try {
      setIsLoading(true);
      const firstName = user?.firstName || "Unknown";
      const lastName = user?.lastName || "";
      const email = user?.email || "unknown@unknown.com";
      const message =
        "The user requests manual access while payments are offline.";

      const response = await api.post("/email", {
        firstName,
        lastName,
        email,
        message,
        type: "access_request",
        course: { title: courseTitle, id: courseId },
      });

      if (response.data?.success) {
        await Swal.fire({
          icon: "success",
          title: "Request Sent",
          text: "Your request has been sent to the admin. Please watch your email for a response.",
        });
      } else {
        throw new Error("Failed to send request");
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Could Not Send Request",
        text: formatErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  }, [courseId, courseTitle, user]);

  const handleFreeEnrollment = useCallback(async () => {
    const enrollmentData = await courseService.enrollFreeCourse(courseId);
    await Swal.fire({
      icon: "success",
      title: "Enrollment Successful",
      text: enrollmentData?.message || "You now have access to this course.",
      confirmButtonText: "Start Learning",
    });
    setHasJustEnrolled(true);
    navigateToLessons();
  }, [courseId, navigateToLessons]);

  const handlePaidEnrollment = useCallback(async () => {
    const result = await Swal.fire({
      icon: "info",
      title: "Payments temporarily unavailable",
      html: "Our payment gateway is undergoing maintenance. If you want access now, you can contact the admin and we will assist you manually.",
      showCancelButton: true,
      confirmButtonText: "Send Message to Admin",
      cancelButtonText: "Close",
    });

    if (result.isConfirmed) {
      await handleContactAdmin();
    }
  }, [handleContactAdmin]);

  const handleEnroll = useCallback(async () => {
    if (!courseId) {
      await Swal.fire({
        icon: "error",
        title: "Missing Course",
        text: "Unable to determine the selected course. Please try again.",
      });
      return;
    }

    if (user?.isBlocked) {
      await Swal.fire({
        title: "Account Blocked",
        text: "Your account has been blocked. Please contact support for assistance.",
        icon: "error",
        confirmButtonText: "Contact Support",
      });
      window.location.href = "mailto:support@scholarx.com";
      return;
    }

    if (!authService.isAuthenticated()) {
      const result = await Swal.fire({
        title: "Login Required",
        text: "Please login to enroll in this course",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
      });
      if (result.isConfirmed) {
        navigate("/login");
      }
      return;
    }

    try {
      setIsLoading(true);
      if (isFreeCourse) {
        await handleFreeEnrollment();
        return;
      }

      await handlePaidEnrollment();
    } catch (error) {
      const message = formatErrorMessage(error);
      if (message.toLowerCase().includes("already")) {
        await showAlreadyEnrolledAlert();
        return;
      }
      await Swal.fire({
        title: "Enrollment Error",
        text: message,
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    courseId,
    handleFreeEnrollment,
    handlePaidEnrollment,
    isFreeCourse,
    navigate,
    showAlreadyEnrolledAlert,
    user,
  ]);

  const handleOpenCourse = useCallback(() => {
    navigateToLessons();
  }, [navigateToLessons]);

  const getEnrollButtonLabel = () => {
    if (isLoading) {
      return isFreeCourse ? "Processing..." : "Sending...";
    }
    return isFreeCourse ? "Enroll Now (Free)" : "Enroll Now";
  };

  return {
    isLoading,
    isFreeCourse,
    canAccessCourse,
    enrollButtonLabel: getEnrollButtonLabel(),
    handleEnroll,
    handleOpenCourse,
  };
};

export default useCourseEnrollment;
