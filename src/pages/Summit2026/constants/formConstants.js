/**
 * @fileoverview Form field configuration constants for the registration form.
 * Strategy Pattern: field definitions drive the form rendering, not hardcoded HTML.
 */

import { SUMMIT_TRACKS } from "./eventData";
import { EGYPTIAN_GOVERNORATES } from "./governorates";

/** Total number of registration form steps */
export const FORM_TOTAL_STEPS = 1;

/**
 * Describes each form step for the StepIndicator component.
 * @type {readonly { step: number, title: string, description: string }[]}
 */
export const FORM_STEPS_META = Object.freeze([
  {
    step: 1,
    title: "Registration Form",
    description: "Complete your details to secure your seat",
  },
]);

/**
 * Attendee status options for Step 2 dropdown.
 * @type {readonly { value: string, label: string }[]}
 */
export const ATTENDEE_STATUS_OPTIONS = Object.freeze([
  { value: "", label: "Select your status..." },
  { value: "undergraduate", label: "Undergraduate Student" },
  { value: "postgraduate", label: "Postgraduate Student" },
  { value: "recent-graduate", label: "Recent Graduate (< 2 years)" },
  { value: "professional", label: "Working Professional" },
  { value: "researcher", label: "Researcher / Academic" },
  { value: "entrepreneur", label: "Entrepreneur" },
  { value: "other", label: "Other" },
]);

/**
 * Graduation year range options.
 * @type {readonly { value: string, label: string }[]}
 */
export const GRADUATION_YEAR_OPTIONS = Object.freeze([
  { value: "", label: "Select year..." },
  ...Array.from({ length: 11 }, (_, i) => {
    const year = 2020 + i;
    return { value: String(year), label: String(year) };
  }),
]);

/**
 * English proficiency levels.
 * @type {readonly { value: string, label: string }[]}
 */
export const ENGLISH_LEVEL_OPTIONS = Object.freeze([
  { value: "", label: "Select your English level..." },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "upper-intermediate", label: "Upper-Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "fluent", label: "Fluent" },
]);

/**
 * How did you hear about us options (multi-select).
 * @type {readonly { value: string, label: string }[]}
 */
export const REFERRAL_SOURCE_OPTIONS = Object.freeze([
  {
    value: "social-media",
    label: "📱 Social Media (Facebook, Instagram, LinkedIn)",
  },
  { value: "friend", label: "👥 Friend / Colleague Recommendation" },
  { value: "university", label: "🎓 University / Campus Announcement" },
  { value: "scholarx-platform", label: "💻 ScholarX Platform" },
  { value: "eu-jeel-connect", label: "🇪🇺 EU Jeel Connect" },
  { value: "email", label: "✉️ Email Newsletter" },
  { value: "other", label: "🔍 Other" },
]);

/**
 * Workshop options for Step 3.
 * @type {readonly { value: string, label: string, track: string }[]}
 */
export const WORKSHOP_OPTIONS = Object.freeze([
  {
    value: "cv-writing",
    label: "CV & Cover Letter Masterclass",
    track: "Career Excellence",
  },
  {
    value: "linkedin-branding",
    label: "LinkedIn & Digital Personal Branding",
    track: "Skills Development",
  },
  {
    value: "scholarship-essay",
    label: "Scholarship Essay Writing",
    track: "Global Education",
  },
  {
    value: "ai-tools",
    label: "AI Tools for Students & Professionals",
    track: "Skills Development",
  },
  {
    value: "interview-prep",
    label: "Interview Preparation & Mock Interviews",
    track: "Career Excellence",
  },
  {
    value: "green-entrepreneurship",
    label: "Green Entrepreneurship & Sustainability",
    track: "Innovation & Impact",
  },
  {
    value: "cybersecurity",
    label: "Cybersecurity Fundamentals",
    track: "Skills Development",
  },
  {
    value: "fulbright",
    label: "Fulbright & US Scholarships Workshop",
    track: "Global Education",
  },
  {
    value: "erasmus",
    label: "Erasmus+ & EU Scholarships Workshop",
    track: "Global Education",
  },
  {
    value: "research-methods",
    label: "Research Methods & Academic Writing",
    track: "Global Education",
  },
  {
    value: "startup-pitch",
    label: "Startup Pitching & Fundraising",
    track: "Innovation & Impact",
  },
  {
    value: "public-speaking",
    label: "Public Speaking & Leadership",
    track: "Career Excellence",
  },
  {
    value: "freelancing",
    label: "Freelancing & Remote Work",
    track: "Skills Development",
  },
  {
    value: "stem-policy",
    label: "STEM Advocacy & Policy Influence",
    track: "Innovation & Impact",
  },
  {
    value: "networking",
    label: "Strategic Networking & Relationship Building",
    track: "Career Excellence",
  },
  {
    value: "data-science",
    label: "Data Science for Decision Makers",
    track: "Skills Development",
  },
]);

/**
 * Re-export track options derived from eventData for form checkboxes.
 */
export const TRACK_OPTIONS = SUMMIT_TRACKS.map(({ id, title }) => ({
  value: id,
  label: title,
}));

/** Re-export for form use */
export { EGYPTIAN_GOVERNORATES };
