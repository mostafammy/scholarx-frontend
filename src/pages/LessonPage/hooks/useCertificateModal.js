/**
 * useCertificateModal Hook
 * Manages certificate modal state and data
 * Following Single Responsibility Principle
 */

import { useState, useCallback } from "react";

/**
 * Custom hook for managing certificate modal
 * @param {Object} courseCompletion - Course completion data
 * @param {Object} course - Course data
 * @param {Object} user - Current user
 * @returns {Object} Modal state and handlers
 */
export const useCertificateModal = (courseCompletion, course, user) => {
  const [isOpen, setIsOpen] = useState(false);
  const [certificateData, setCertificateData] = useState(null);

  // Open modal with certificate data
  const openModal = useCallback(() => {
    if (!courseCompletion || !user || !course) {
      return;
    }

    setCertificateData({
      studentName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      courseName: course.title,
      courseId: course._id, // Required for PDF download
      completedAt: courseCompletion.completedAt,
      certificateId: courseCompletion.certificateId,
      completionPercentage: courseCompletion.completionPercentage,
    });
    setIsOpen(true);
  }, [courseCompletion, course, user]);

  // Close modal
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setCertificateData(null);
  }, []);

  return {
    isOpen,
    certificateData,
    openModal,
    closeModal,
  };
};
