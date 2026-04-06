/**
 * @fileoverview Yup validation schemas for each registration form step.
 * Strategy Pattern: each step has an independent validator schema.
 * Open/Closed: add new steps by adding new schemas — existing schemas unchanged.
 */

import * as Yup from "yup";
import { normalizeProfileType } from "./profileDrafts";
import {
  normalisePhoneNumber,
  isValidE164YupTest,
} from "../../../utils/phoneValidation";

/** @type {import('yup').ObjectSchema} */
export const step1Schema = Yup.object({
  fullName: Yup.string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name must be less than 100 characters")
    .required("Full name is required"),

  email: Yup.string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email is required"),

  phone: Yup.string()
    .transform((value) => normalisePhoneNumber(value))
    .test(
      "e164",
      "Please enter a valid international phone number (e.g. +20 111...)",
      isValidE164YupTest,
    )
    .required("Phone number is required"),

  nationalId: Yup.string()
    .transform((value) => String(value || "").replace(/\D/g, ""))
    .matches(/^\d{14}$/, "National ID must be exactly 14 digits")
    .required("National ID is required"),

  governorate: Yup.string()
    .trim()
    .min(2, "Please select your governorate")
    .required("Governorate is required"),

  status: Yup.string()
    .transform((value) => normalizeProfileType(value))
    .oneOf(["highSchool", "undergraduate", "graduate", "professional", "other"])
    .required("Please select your current status"),

  highSchoolName: Yup.string()
    .trim()
    .when("status", {
      is: "highSchool",
      then: (schema) =>
        schema
          .min(2, "High school name must be at least 2 characters")
          .max(120, "High school name must be less than 120 characters")
          .required("High school name is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  highSchoolYear: Yup.string().when("status", {
    is: "highSchool",
    then: (schema) =>
      schema
        .oneOf(["grade-10", "grade-11", "grade-12", "gap-year"])
        .required("Please select your current high school year"),
    otherwise: (schema) => schema.notRequired(),
  }),

  universityName: Yup.string()
    .trim()
    .when("status", {
      is: (value) => value === "undergraduate" || value === "graduate",
      then: (schema) =>
        schema
          .min(2, "University name must be at least 2 characters")
          .max(140, "University name must be less than 140 characters")
          .required("University name is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  major: Yup.string()
    .trim()
    .when("status", {
      is: (value) => value === "undergraduate" || value === "graduate",
      then: (schema) =>
        schema
          .min(2, "Major must be at least 2 characters")
          .max(100, "Major must be less than 100 characters")
          .required("Major is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  undergraduateYear: Yup.string().when("status", {
    is: "undergraduate",
    then: (schema) =>
      schema
        .oneOf([
          "year-1",
          "year-2",
          "year-3",
          "year-4",
          "year-5-plus",
          "gap-year",
        ])
        .required("Please select your current university year"),
    otherwise: (schema) => schema.notRequired(),
  }),

  jobTitle: Yup.string()
    .trim()
    .when("status", {
      is: "professional",
      then: (schema) =>
        schema
          .min(2, "Job title must be at least 2 characters")
          .max(100, "Job title must be less than 100 characters")
          .required("Job title is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  yearsOfExperience: Yup.number()
    .transform((value, originalValue) => {
      if (
        originalValue === "" ||
        originalValue === null ||
        typeof originalValue === "undefined"
      ) {
        return undefined;
      }
      return value;
    })
    .when("status", {
      is: "professional",
      then: (schema) =>
        schema
          .typeError("Years of experience must be a number")
          .integer("Years of experience must be a whole number")
          .min(0, "Years of experience cannot be negative")
          .max(50, "Years of experience must be 50 or less")
          .required("Years of experience is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  profileDescription: Yup.string()
    .trim()
    .when("status", {
      is: "other",
      then: (schema) =>
        schema
          .min(10, "Please describe your profile in at least 10 characters")
          .max(500, "Profile description must be less than 500 characters")
          .required("Please describe your current profile"),
      otherwise: (schema) => schema.notRequired(),
    }),

  primaryGoals: Yup.array()
    .of(
      Yup.string().oneOf([
        "find-scholarship",
        "develop-skills",
        "build-network",
        "accelerate-career",
        "meet-industry-experts",
        "something-else",
        // Backward compatibility for stale clients/cached drafts.
        "career-growth",
        "meet-experts",
        "other",
      ]),
    )
    .min(1, "Please select at least one goal")
    .required("Please select at least one goal"),

  englishLevel: Yup.string()
    .oneOf([
      "beginner",
      "intermediate",
      "upper-intermediate",
      "advanced",
      "fluent",
    ])
    .required("Please select your English level"),

  appliedForScholarshipsRecently: Yup.string()
    .oneOf(["yes", "no"])
    .required("Please select whether you applied for scholarships recently"),

  biggestScholarshipHurdle: Yup.string()
    .trim()
    .min(5, "Please describe your biggest hurdle in at least 5 characters")
    .max(500, "Biggest hurdle must be less than 500 characters")
    .required("Please tell us your biggest hurdle"),

  acceptTerms: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions to register")
    .required("You must accept the terms and conditions to register"),
});

/** @type {import('yup').ObjectSchema} */
export const step2Schema = step1Schema;

/** @type {import('yup').ObjectSchema} */
export const step3Schema = step1Schema;

/**
 * Returns the validation schema for the given step number.
 * @param {1 | 2 | 3} step
 * @returns {import('yup').ObjectSchema}
 */
export const getSchemaForStep = (step) => {
  const schemas = { 1: step1Schema, 2: step2Schema, 3: step3Schema };
  return schemas[step] ?? step1Schema;
};
