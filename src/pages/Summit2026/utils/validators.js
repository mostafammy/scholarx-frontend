/**
 * @fileoverview Yup validation schemas for each registration form step.
 * Strategy Pattern: each step has an independent validator schema.
 * Open/Closed: add new steps by adding new schemas — existing schemas unchanged.
 */

import * as Yup from 'yup';

/** @type {import('yup').ObjectSchema} */
export const step1Schema = Yup.object({
  fullName: Yup.string()
    .trim()
    .min(3, 'Full name must be at least 3 characters')
    .max(100, 'Full name must be less than 100 characters')
    .required('Full name is required'),

  email: Yup.string()
    .trim()
    .email('Please enter a valid email address')
    .required('Email is required'),

  phone: Yup.string()
    .min(7, 'Please enter a valid phone number')
    .required('Phone number is required'),

  university: Yup.string()
    .trim()
    .min(3, 'Institution name must be at least 3 characters')
    .max(150, 'Institution name must be less than 150 characters')
    .required('University / Institution is required'),

  governorate: Yup.string()
    .trim()
    .min(2, 'Please select your governorate')
    .required('Governorate is required'),

  fieldOfStudy: Yup.string()
    .trim()
    .min(2, 'Academic major must be at least 2 characters')
    .max(100, 'Academic major must be less than 100 characters')
    .required('Academic major / field is required'),

  primaryGoal: Yup.string()
    .oneOf(['find-scholarship', 'develop-skills', 'build-network', 'other'])
    .required('Please select your primary goal'),

  englishLevel: Yup.string()
    .oneOf(['beginner', 'intermediate', 'upper-intermediate', 'advanced', 'fluent'])
    .required('Please select your English level'),

  acceptTerms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions to register')
    .required('You must accept the terms and conditions to register'),
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
