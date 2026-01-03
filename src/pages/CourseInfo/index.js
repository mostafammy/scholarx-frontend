/**
 * CourseInfo Module Barrel Export
 * Central export point for the CourseInfo page and related utilities
 */

// Main Page Component
export { default } from "./CourseInfo";
export { default as CoursePage } from "./CourseInfo";

// Hooks
export * from "./hooks";

// Components
export * from "./components";

// Utils
export { mapCourseData, createCourseStats } from "./utils/courseDataMapper";

// Constants
export * from "./constants";

// Fallback Data
export { default as courseDataFallback } from "./CourseData";
