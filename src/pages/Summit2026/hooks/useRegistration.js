/**
 * @fileoverview useRegistration — multi-step form state and submission logic.
 * Single Responsibility: ONLY manages form state, step navigation, and submission.
 * Consumers (components) are completely decoupled from data persistence.
 *
 * @module useRegistration
 */

import { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Swal from "sweetalert2";
import { registrationRepository } from "../services/RegistrationRepository";
import { getSchemaForStep } from "../utils/validators";
import { FORM_TOTAL_STEPS } from "../constants/formConstants";

const mapGoalToTrack = (primaryGoal) => {
  switch (primaryGoal) {
    case "find-scholarship":
      return "global-education";
    case "develop-skills":
      return "skills-development";
    case "build-network":
      return "career-excellence";
    default:
      return "innovation-impact";
  }
};

/**
 * @typedef {Object} UseRegistrationReturn
 * @property {number} currentStep - Active step number (1–3)
 * @property {boolean} isFirstStep
 * @property {boolean} isLastStep
 * @property {boolean} isSubmitting
 * @property {import('react-hook-form').UseFormReturn} form - RHF form instance for current step
 * @property {Record<string, unknown>} allFormData - Accumulated form data across all steps
 * @property {(data: Record<string, unknown>) => Promise<void>} onNext - Validates and moves to next step or submits
 * @property {() => void} onBack - Moves to the previous step
 * @property {boolean} isSuccess - True after successful submission (for thank-you UI)
 */

/**
 * Orchestrates multi-step form state for the summit registration.
 * @returns {UseRegistrationReturn}
 */
export const useRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [allFormData, setAllFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const schema = useMemo(() => getSchemaForStep(currentStep), [currentStep]);

  const form = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: allFormData,
  });

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === FORM_TOTAL_STEPS;

  /**
   * Handles "Next" button: merges step data and advances step, or submits on last step.
   */
  const onNext = useCallback(
    async (stepData) => {
      const merged = { ...allFormData, ...stepData };
      setAllFormData(merged);

      if (!isLastStep) {
        setCurrentStep((prev) => prev + 1);
        return;
      }

      // Final submission
      setIsSubmitting(true);
      try {
        const track = mapGoalToTrack(merged.primaryGoal);
        const payload = {
          ...merged,
          graduationYear:
            Number(merged.graduationYear) || new Date().getFullYear(),
          status: merged.status,
          englishLevel: merged.englishLevel || "intermediate",
          appliedForScholarshipsRecently:
            merged.appliedForScholarshipsRecently === "yes",
          biggestScholarshipHurdle:
            merged.biggestScholarshipHurdle?.trim() || "Not provided",
          governorate: merged.governorate || "cairo",
          referralSources: merged.referralSources?.length
            ? merged.referralSources
            : ["other"],
          tracks: merged.tracks?.length ? merged.tracks : [track],
          workshops: merged.workshops?.length
            ? merged.workshops
            : ["networking"],
          specialAccommodations: merged.specialAccommodations || "",
          fieldOfStudy: merged.fieldOfStudy || "General Studies",
          acceptTerms: true,
        };

        await registrationRepository.save(payload);
        setIsSuccess(true);
        await Swal.fire({
          title: "🎉 Registration Confirmed!",
          html: `
            <p style="color: #e2e8f0; font-size: 1rem; line-height: 1.6;">
              Welcome to <strong style="color: #f5c518;">Next Scholar Summit 2026</strong>!<br/>
              We've received your registration. You'll hear from us soon.
            </p>
            <p style="color: rgba(255,255,255,0.5); font-size: 0.875rem; margin-top: 12px;">
              📅 May 1st, 2026 · Nile University, Giza
            </p>
          `,
          icon: "success",
          confirmButtonText: "See You There! 🚀",
          background: "#0d1529",
          color: "#ffffff",
          confirmButtonColor: "#f5c518",
          customClass: { confirmButton: "summit-swal-btn" },
        });
      } catch (error) {
        const isDuplicate = error?.message
          ?.toLowerCase?.()
          .includes("already registered");
        await Swal.fire({
          title: isDuplicate ? "⚠️ Already Registered" : "❌ Submission Failed",
          text: isDuplicate
            ? "This email address is already registered for the summit."
            : "Something went wrong. Please try again.",
          icon: isDuplicate ? "warning" : "error",
          confirmButtonText: "OK",
          background: "#0d1529",
          color: "#ffffff",
          confirmButtonColor: "#f5c518",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [allFormData, isLastStep],
  );

  const onBack = useCallback(() => {
    if (!isFirstStep) setCurrentStep((prev) => prev - 1);
  }, [isFirstStep]);

  return {
    currentStep,
    isFirstStep,
    isLastStep,
    isSubmitting,
    form,
    allFormData,
    onNext,
    onBack,
    isSuccess,
  };
};
