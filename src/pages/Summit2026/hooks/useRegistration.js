/**
 * @fileoverview useRegistration — multi-step form state and submission logic.
 * Single Responsibility: ONLY manages form state, step navigation, and submission.
 * Consumers (components) are completely decoupled from data persistence.
 *
 * @module useRegistration
 */

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Swal from "sweetalert2";
import { registrationRepository } from "../services/RegistrationRepository";
import { getSchemaForStep } from "../utils/validators";
import { FORM_TOTAL_STEPS } from "../constants/formConstants";
import {
  PROFILE_FIELD_KEYS,
  createBranchDraftStore,
  hydrateBranchDraft,
  normalizeProfileType,
  snapshotBranchDraft,
  pruneActiveBranchPayload,
} from "../utils/profileDrafts";

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

const mapGoalsToTracks = (primaryGoals = []) => {
  const goals = Array.isArray(primaryGoals) ? primaryGoals : [];
  const tracks = goals.map(mapGoalToTrack);
  return Array.from(new Set(tracks));
};

const ALL_PROFILE_FIELDS = Object.values(PROFILE_FIELD_KEYS).flat();

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
  const [showProfileSwitchNotice, setShowProfileSwitchNotice] = useState(false);

  const schema = useMemo(() => getSchemaForStep(currentStep), [currentStep]);

  const form = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: allFormData,
  });

  const profileType = normalizeProfileType(form.watch("status"));
  const previousProfileTypeRef = useRef();
  const hasShownSwitchNoticeRef = useRef(false);
  const branchDraftsRef = useRef({
    ...createBranchDraftStore(),
  });

  useEffect(() => {
    if (!profileType) {
      return;
    }

    const previousProfileType = previousProfileTypeRef.current;
    if (!previousProfileType) {
      previousProfileTypeRef.current = profileType;
      return;
    }

    if (previousProfileType === profileType) {
      return;
    }

    branchDraftsRef.current[previousProfileType] = snapshotBranchDraft(
      previousProfileType,
      form.getValues(),
    );

    for (const field of ALL_PROFILE_FIELDS) {
      form.setValue(field, undefined, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    }

    const nextDraft = hydrateBranchDraft(branchDraftsRef.current, profileType);
    Object.entries(nextDraft).forEach(([key, value]) => {
      form.setValue(key, value, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    });

    if (!hasShownSwitchNoticeRef.current) {
      setShowProfileSwitchNotice(true);
      hasShownSwitchNoticeRef.current = true;
    }

    previousProfileTypeRef.current = profileType;
  }, [form, profileType]);

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
        const selectedGoals =
          merged.primaryGoals && merged.primaryGoals.length > 0
            ? merged.primaryGoals
            : ["other"];
        const mappedTracks = mapGoalsToTracks(selectedGoals);
        const selectedProfileType =
          normalizeProfileType(merged.status) || "other";
        const { profileDetails, ...payload } = pruneActiveBranchPayload({
          profileType: selectedProfileType,
          values: merged,
          branchDrafts: branchDraftsRef.current,
          baseFields: [
            "fullName",
            "email",
            "phone",
            "locale",
            "englishLevel",
            "appliedForScholarshipsRecently",
            "biggestScholarshipHurdle",
            "governorate",
            "primaryGoals",
            "referralSources",
            "tracks",
            "workshops",
            "specialAccommodations",
            "acceptTerms",
          ],
        });

        await registrationRepository.save({
          ...payload,
          profileType: selectedProfileType,
          profileDetails,
          englishLevel: merged.englishLevel || "intermediate",
          appliedForScholarshipsRecently:
            merged.appliedForScholarshipsRecently === "yes",
          biggestScholarshipHurdle:
            merged.biggestScholarshipHurdle?.trim() || "Not provided",
          governorate: merged.governorate || "cairo",
          primaryGoals: selectedGoals,
          primaryGoal: selectedGoals[0],
          referralSources: merged.referralSources?.length
            ? merged.referralSources
            : ["other"],
          tracks: merged.tracks?.length ? merged.tracks : mappedTracks,
          workshops: merged.workshops?.length
            ? merged.workshops
            : ["networking"],
          specialAccommodations: merged.specialAccommodations || "",
          acceptTerms: true,
        });
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
        const normalizedMessage = String(error?.message || "").toLowerCase();
        const isDuplicate = normalizedMessage.includes("already registered");
        const isRateLimited =
          normalizedMessage.includes("too many") ||
          normalizedMessage.includes("rate limit") ||
          normalizedMessage.includes("429");
        const isTimeoutOrNetwork =
          normalizedMessage.includes("timeout") ||
          normalizedMessage.includes("network") ||
          normalizedMessage.includes("failed to submit summit registration");

        const title = isDuplicate
          ? "⚠️ Already Registered"
          : isRateLimited
            ? "⏳ Too Many Attempts"
            : "❌ Submission Failed";

        const text = isDuplicate
          ? "This email address is already registered for the summit."
          : isRateLimited
            ? "We received too many requests from your network. Please wait a minute, then try again."
            : isTimeoutOrNetwork
              ? "Your connection looks unstable. Please check internet and try again."
              : "Something went wrong. Please try again.";

        await Swal.fire({
          title,
          text,
          icon: isDuplicate || isRateLimited ? "warning" : "error",
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
    showProfileSwitchNotice,
    onNext,
    onBack,
    isSuccess,
  };
};
