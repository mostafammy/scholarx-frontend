import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventRegistrationSchema } from "./eventRegistrationSchema";
import "./EventRegistrationModal.css";

/**
 * EventRegistrationModal Component
 * Modal form for event interest registration with conditional fields
 */
const EventRegistrationModal = ({
  isOpen,
  onClose,
  onSubmit,
  eventTitle = "Event",
  eventId = null,
  userData = null,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(eventRegistrationSchema),
    defaultValues: {
      fullName: "",
      location: "",
      age: "",
      studyLevel: "",
      university: "",
      faculty: "",
      email: "",
      whatsAppNumber: "",
      interests: [],
      eventId: eventId || "",
    },
  });

  // Pre-fill form with user data when modal opens
  useEffect(() => {
    if (isOpen && userData) {
      // Map user data to form fields
      // Handles both cases where user keys might be different (e.g. name vs fullName)
      const formValues = {
        fullName: userData.name || userData.fullName || "",
        email: userData.email || "",
        location: userData.location || userData.address || "",
        // Don't pre-fill other fields unless we are sure of the structure
        eventId: eventId || "",
      };

      // Use reset to set all values at once, merging with existing defaults if needed
      // We need to be careful not to overwrite with empty strings if the user has typed something
      // But typically we reset on open.
      reset(formValues);
      // Ensure eventId is set
      setValue("eventId", eventId || "");
    }
  }, [isOpen, userData, eventId, reset, setValue]);

  // ensure eventId is present in form values for resolver validation
  useEffect(() => {
    setValue("eventId", eventId || "");
  }, [eventId, setValue]);

  const studyLevel = watch("studyLevel");
  const showUniversityFields =
    studyLevel === "undergraduate" || studyLevel === "postgraduate";

  // Reset form when modal closes (optional, but good for cleanup)
  useEffect(() => {
    if (!isOpen) {
      // We don't necessarily want to reset here if we want to preserve state if they accidentally close
      // But the original code did reset. We'll leave it or modify it.
      // The original code reset on !isOpen.
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
      const payload = eventId ? { ...data, eventId } : data;
      await onSubmit(payload);
      reset();
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const studyLevelOptions = [
    { value: "", label: "Select your study level" },
    { value: "undergraduate", label: "Undergraduate" },
    { value: "postgraduate", label: "Postgraduate" },
    { value: "professional", label: "Professional" },
  ];

  const interestOptions = [
    "Scholarship Opportunities",
    "Career Development",
    "Networking",
    "Academic Excellence",
    "Leadership Skills",
    "Community Service",
    "Research",
    "Entrepreneurship",
  ];

  return (
    <div className="event-modal-overlay" onClick={handleBackdropClick}>
      <div className="event-modal">
        <div className="event-modal__header">
          <h2 className="event-modal__title">
            Register Interest - {eventTitle}
          </h2>
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
                className={`form-input ${errors.fullName ? "form-input--error" : ""} ${userData?.name || userData?.fullName ? "form-input--disabled" : ""}`}
                placeholder="Enter your full name"
                {...register("fullName")}
                disabled={!!(userData?.name || userData?.fullName)}
              />
              {errors.fullName && (
                <span className="form-error">{errors.fullName.message}</span>
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
                Include country code (e.g., +1, +44, +91)
              </small>
            </div>

            {/* Interests */}
            <div className="form-group">
              <label className="form-label">
                Interests <span className="required">*</span>
              </label>
              <div className="interests-grid">
                {interestOptions.map((interest) => (
                  <label key={interest} className="interest-checkbox">
                    <input
                      type="checkbox"
                      value={interest}
                      {...register("interests")}
                    />
                    <span className="interest-label">{interest}</span>
                  </label>
                ))}
              </div>
              {errors.interests && (
                <span className="form-error">{errors.interests.message}</span>
              )}
            </div>
          </div>

          <div className="event-modal__footer">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Registration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EventRegistrationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  eventTitle: PropTypes.string,
  eventId: PropTypes.string,
};

export default EventRegistrationModal;
