import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { salesInquirySchema } from "./salesInquirySchema";
import { salesInquiryService } from "../../services/api";
import styles from "./SalesInquiryModal.module.css";

/**
 * Derives the user's full name from various user object shapes.
 */
const deriveFullName = (user) => {
  if (!user) return "";
  if (user.fullName) return user.fullName;
  if (user.name) return user.name;
  if (user.firstName)
    return user.lastName
      ? `${user.firstName} ${user.lastName}`.trim()
      : user.firstName;
  return "";
};

/**
 * SalesInquiryModal
 *
 * Portal-rendered modal for users to express interest in a paid course.
 * Pre-fills fullName and email from the logged-in user profile.
 * Uses react-hook-form + Zod for validation.
 * Uses react-phone-input-2 for the WhatsApp number field.
 *
 * @param {{ isOpen, onClose, courseId, courseTitle, userData, onSuccess }} props
 */
const SalesInquiryModal = ({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  userData,
  onSuccess,
}) => {
  const fullName = deriveFullName(userData);
  const email = userData?.email || "";

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(salesInquirySchema),
    defaultValues: {
      fullName: "",
      email: "",
      whatsAppNumber: "",
      company: "",
      message: "",
    },
  });

  const message = watch("message") || "";

  /* Pre-fill user data when modal opens */
  useEffect(() => {
    if (isOpen) {
      if (fullName) setValue("fullName", fullName, { shouldValidate: false });
      if (email) setValue("email", email, { shouldValidate: false });
    }
  }, [isOpen, fullName, email, setValue]);

  /* Reset form when modal closes */
  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  /* ESC key + body scroll lock */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleFormSubmit = async (data) => {
    try {
      const payload = {
        fullName: data.fullName,
        email: data.email,
        whatsAppNumber: data.whatsAppNumber,
        ...(data.company?.trim() ? { company: data.company.trim() } : {}),
        ...(data.message?.trim() ? { message: data.message.trim() } : {}),
      };

      await salesInquiryService.submitInquiry(courseId, payload);

      await Swal.fire({
        icon: "success",
        title: "Inquiry Submitted!",
        text: "Our sales team will contact you on the WhatsApp number you provided.",
        confirmButtonText: "Got it",
        confirmButtonColor: "#2563eb",
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      const httpStatus = error?.response?.status;

      // 409 — already submitted an inquiry
      if (httpStatus === 409) {
        const msg =
          error?.response?.data?.message ||
          "You have already submitted an inquiry for this course. Our team will be in touch!";
        await Swal.fire({
          icon: "info",
          title: "Inquiry Already Submitted",
          text: msg,
          confirmButtonColor: "#2563eb",
        });
        onSuccess?.();
        onClose();
        return;
      }

      // 400 — field-level validation errors: map inline under each field, keep form open
      if (httpStatus === 400) {
        const fieldErrors = error?.response?.data?.data;
        if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
          fieldErrors.forEach(({ path, message }) => {
            if (path) setError(path, { type: "server", message });
          });
          return;
        }
        await Swal.fire({
          icon: "warning",
          title: "Submission Error",
          text:
            error?.response?.data?.message ||
            "Please check your input and try again.",
          confirmButtonColor: "#2563eb",
        });
        return;
      }

      // 5xx or unexpected error
      await Swal.fire({
        icon: "error",
        title: "Something Went Wrong",
        text: error?.message || "Please try again or contact support.",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  const isDisabled = isSubmitting;

  return ReactDOM.createPortal(
    <div
      className={styles.overlay}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Sales inquiry for ${courseTitle}`}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* ── Header ─────────────────────────────── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.label}>Sales Inquiry</span>
            <h2 className={styles.title}>{courseTitle}</h2>
            <p className={styles.subtitle}>
              Fill in your details and our team will reach out within 24 hours.
            </p>
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            ×
          </button>
        </div>

        {/* ── Form ───────────────────────────────── */}
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <div className={styles.body}>
            {/* Full Name + Email — two column */}
            <div className={styles.row}>
              {/* Full Name */}
              <div className={styles.fieldGroup}>
                <label htmlFor="si-fullName" className={styles.label2}>
                  Full Name <span className={styles.required}>*</span>
                </label>
                <input
                  id="si-fullName"
                  type="text"
                  className={[
                    styles.input,
                    errors.fullName ? styles.error : "",
                    fullName ? styles.prefilled : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  placeholder="Sara Ahmed"
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className={styles.errorMsg}>{errors.fullName.message}</p>
                )}
              </div>

              {/* Email */}
              <div className={styles.fieldGroup}>
                <label htmlFor="si-email" className={styles.label2}>
                  Email <span className={styles.required}>*</span>
                </label>
                <input
                  id="si-email"
                  type="email"
                  className={[
                    styles.input,
                    errors.email ? styles.error : "",
                    email ? styles.prefilled : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  placeholder="sara@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className={styles.errorMsg}>{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* WhatsApp Number */}
            <div className={styles.fieldGroup}>
              <label htmlFor="si-whatsapp" className={styles.label2}>
                WhatsApp Number <span className={styles.required}>*</span>
              </label>
              <div className={styles.phoneHint}>
                Enter digits only, e.g.{" "}
                <span className={styles.phoneExample}>201012345678</span>
              </div>
              <input
                id="si-whatsapp"
                type="tel"
                inputMode="numeric"
                className={[
                  styles.input,
                  errors.whatsAppNumber ? styles.error : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                placeholder="201012345678"
                {...register("whatsAppNumber")}
              />
              {errors.whatsAppNumber && (
                <p className={styles.errorMsg}>
                  {errors.whatsAppNumber.message}
                </p>
              )}
            </div>

            {/* Company — optional */}
            <div className={styles.fieldGroup}>
              <label htmlFor="si-company" className={styles.label2}>
                Company / Organization
                <span className={styles.optional}>(optional)</span>
              </label>
              <input
                id="si-company"
                type="text"
                className={[styles.input, errors.company ? styles.error : ""]
                  .filter(Boolean)
                  .join(" ")}
                placeholder="Acme Corp"
                {...register("company")}
              />
              {errors.company && (
                <p className={styles.errorMsg}>{errors.company.message}</p>
              )}
            </div>

            {/* Message — optional */}
            <div className={styles.fieldGroup}>
              <label htmlFor="si-message" className={styles.label2}>
                Message
                <span className={styles.optional}>(optional)</span>
              </label>
              <textarea
                id="si-message"
                className={[
                  styles.input,
                  styles.textarea,
                  errors.message ? styles.error : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                placeholder="Tell us what you'd like to know about this course…"
                maxLength={1000}
                {...register("message")}
              />
              <div
                className={[
                  styles.textareaFooter,
                  message.length > 950 ? styles.overLimit : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {message.length} / 1000
              </div>
              {errors.message && (
                <p className={styles.errorMsg}>{errors.message.message}</p>
              )}
            </div>
          </div>

          {/* ── Footer ─────────────────────────────── */}
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.btnCancel}
              onClick={onClose}
              disabled={isDisabled}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.btnSubmit}
              disabled={isDisabled}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner} aria-hidden="true" />
                  Submitting…
                </>
              ) : (
                "Submit Inquiry"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};

SalesInquiryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  courseId: PropTypes.string,
  courseTitle: PropTypes.string,
  userData: PropTypes.object,
  onSuccess: PropTypes.func,
};

SalesInquiryModal.defaultProps = {
  courseId: null,
  courseTitle: "this course",
  userData: null,
  onSuccess: null,
};

export default SalesInquiryModal;
