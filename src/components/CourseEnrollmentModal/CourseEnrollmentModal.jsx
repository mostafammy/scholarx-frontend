import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseEnrollmentSchema } from "./courseEnrollmentSchema";
// Reuse the same styling as EventRegistrationModal
import "../../pages/Services/components/EventRegistrationModal/EventRegistrationModal.css";

/**
 * CourseEnrollmentModal Component
 * Modal form for collecting user data before course enrollment
 * Uses React Portal to render at document body level
 * Styled identically to EventRegistrationModal
 */
const CourseEnrollmentModal = ({
  isOpen,
  onClose,
  onSubmit,
  courseTitle = "Course",
  courseId = null,
  userData = null,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(courseEnrollmentSchema),
    defaultValues: {
      fullName: "",
      email: "",
      location: "",
      age: "",
      studyLevel: "",
      university: "",
      faculty: "",
      whatsAppNumber: "",
      courseId: courseId || "",
    },
  });

  const studyLevel = watch("studyLevel");
  const showUniversityFields =
    studyLevel === "undergraduate" || studyLevel === "postgraduate";

  // Helper to get full name from user data
  const getUserFullName = (user) => {
    if (!user) return "";
    if (user.fullName) return user.fullName;
    if (user.name) return user.name;
    if (user.firstName) {
      return user.lastName
        ? `${user.firstName} ${user.lastName}`.trim()
        : user.firstName;
    }
    return "";
  };

  // Pre-fill form with user data when modal opens
  useEffect(() => {
    if (isOpen && userData) {
      const formValues = {
        fullName: getUserFullName(userData),
        email: userData.email || "",
        location: userData.location || userData.address || "",
        courseId: courseId || "",
      };

      Object.entries(formValues).forEach(([key, value]) => {
        if (value) {
          setValue(key, value.trim ? value.trim() : value);
        }
      });
    }
  }, [isOpen, userData, courseId, setValue]);

  // Ensure courseId is present
  useEffect(() => {
    setValue("courseId", courseId || "");
  }, [courseId, setValue]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleFormSubmit = async (data) => {
    try {
      const payload = { ...data, courseId };
      await onSubmit(payload);
      reset();
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleBackdropClick = (e) => {
    e.stopPropagation(); // Prevent click from bubbling to CourseCard
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Stop propagation on modal content to prevent clicks from reaching CourseCard
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  const studyLevelOptions = [
    { value: "", label: "Select your study level" },
    { value: "undergraduate", label: "Undergraduate" },
    { value: "postgraduate", label: "Postgraduate" },
    { value: "professional", label: "Professional" },
  ];

  const formIsLoading = isSubmitting || isLoading;

  // Use React Portal to render modal at document body level
  // This ensures the modal overlays on top of everything
  return ReactDOM.createPortal(
    <div className="event-modal-overlay" onClick={handleBackdropClick}>
      <div className="event-modal" onClick={handleModalClick}>
        <div className="event-modal__header">
          <h2 className="event-modal__title">Apply for {courseTitle}</h2>
          <button
            className="event-modal__close"
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            ×
          </button>
        </div>

        <form
          className="event-modal__form"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <div className="event-modal__body">
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                Full Name <span className="required">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                className={`form-input ${errors.fullName ? "form-input--error" : ""} ${getUserFullName(userData) ? "form-input--disabled" : ""}`}
                placeholder="Enter your full name"
                {...register("fullName")}
                disabled={!!getUserFullName(userData)}
              />
              {errors.fullName && (
                <span className="form-error">{errors.fullName.message}</span>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email <span className="required">*</span>
              </label>
              <input
                id="email"
                type="email"
                className={`form-input ${errors.email ? "form-input--error" : ""} ${userData?.email ? "form-input--disabled" : ""}`}
                placeholder="Enter your email address"
                {...register("email")}
                disabled={!!userData?.email}
              />
              {errors.email && (
                <span className="form-error">{errors.email.message}</span>
              )}
            </div>

            {/* Location */}
            <div className="form-group">
              <label htmlFor="location" className="form-label">
                Location <span className="required">*</span>
              </label>
              <input
                id="location"
                type="text"
                className={`form-input ${errors.location ? "form-input--error" : ""}`}
                placeholder="Enter your city/country"
                {...register("location")}
              />
              {errors.location && (
                <span className="form-error">{errors.location.message}</span>
              )}
            </div>

            {/* Age */}
            <div className="form-group">
              <label htmlFor="age" className="form-label">
                Age <span className="required">*</span>
              </label>
              <input
                id="age"
                type="number"
                className={`form-input ${errors.age ? "form-input--error" : ""}`}
                placeholder="Enter your age"
                {...register("age", { valueAsNumber: true })}
              />
              {errors.age && (
                <span className="form-error">{errors.age.message}</span>
              )}
            </div>

            {/* Study Level */}
            <div className="form-group">
              <label htmlFor="studyLevel" className="form-label">
                Study Level <span className="required">*</span>
              </label>
              <select
                id="studyLevel"
                className={`form-select ${errors.studyLevel ? "form-input--error" : ""}`}
                {...register("studyLevel")}
              >
                {studyLevelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.studyLevel && (
                <span className="form-error">{errors.studyLevel.message}</span>
              )}
            </div>

            {/* Conditional University Field */}
            {showUniversityFields && (
              <>
                <div className="form-group">
                  <label htmlFor="university" className="form-label">
                    University <span className="required">*</span>
                  </label>
                  <input
                    id="university"
                    type="text"
                    className={`form-input ${errors.university ? "form-input--error" : ""}`}
                    placeholder="Enter your university name"
                    {...register("university")}
                  />
                  {errors.university && (
                    <span className="form-error">
                      {errors.university.message}
                    </span>
                  )}
                </div>

                {/* Conditional Faculty Field */}
                <div className="form-group">
                  <label htmlFor="faculty" className="form-label">
                    Faculty <span className="required">*</span>
                  </label>
                  <input
                    id="faculty"
                    type="text"
                    className={`form-input ${errors.faculty ? "form-input--error" : ""}`}
                    placeholder="Enter your faculty/department"
                    {...register("faculty")}
                  />
                  {errors.faculty && (
                    <span className="form-error">{errors.faculty.message}</span>
                  )}
                </div>
              </>
            )}

            {/* WhatsApp Number */}
            <div className="form-group">
              <label htmlFor="whatsAppNumber" className="form-label">
                WhatsApp Number <span className="required">*</span>
              </label>
              <input
                id="whatsAppNumber"
                type="tel"
                className={`form-input ${errors.whatsAppNumber ? "form-input--error" : ""}`}
                placeholder="+1234567890 (include country code)"
                {...register("whatsAppNumber")}
              />
              {errors.whatsAppNumber && (
                <span className="form-error">
                  {errors.whatsAppNumber.message}
                </span>
              )}
              <small className="form-hint">
                Include country code (e.g., +1, +44, +20)
              </small>
            </div>
          </div>

          <div className="event-modal__footer">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onClose}
              disabled={formIsLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={formIsLoading}
            >
              {formIsLoading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};

CourseEnrollmentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  courseTitle: PropTypes.string,
  courseId: PropTypes.string,
  userData: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default CourseEnrollmentModal;
