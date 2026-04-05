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

  graduationYear: Yup.string()
    .required('Please select your graduation year'),
});

/** @type {import('yup').ObjectSchema} */
export const step2Schema = Yup.object({
  status: Yup.string()
    .required('Please select your current status'),

  fieldOfStudy: Yup.string()
    .trim()
    .min(2, 'Field of study must be at least 2 characters')
    .max(100, 'Field of study must be less than 100 characters')
    .required('Field of study / industry is required'),

  governorate: Yup.string()
    .required('Please select your governorate'),

  referralSources: Yup.array()
    .of(Yup.string())
    .min(1, 'Please select at least one source')
    .required('Please tell us how you heard about the summit'),
});

/** @type {import('yup').ObjectSchema} */
export const step3Schema = Yup.object({
  tracks: Yup.array()
    .of(Yup.string())
    .min(1, 'Please select at least one track of interest')
    .required('Please select at least one track of interest'),

  workshops: Yup.array()
    .of(Yup.string())
    .min(1, 'Please select at least one workshop')
    .max(5, 'You may select up to 5 workshops'),

  specialAccommodations: Yup.string()
    .max(500, 'Please keep accommodations note under 500 characters'),

  acceptTerms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions to register')
    .required('You must accept the terms and conditions to register'),
});

/**
 * Returns the validation schema for the given step number.
 * @param {1 | 2 | 3} step
 * @returns {import('yup').ObjectSchema}
 */
export const getSchemaForStep = (step) => {
  const schemas = { 1: step1Schema, 2: step2Schema, 3: step3Schema };
  return schemas[step] ?? step1Schema;
};
