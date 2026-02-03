/**
 * Course Data Mapper Utility
 * Normalizes course data from various API response formats
 * Following Single Responsibility Principle
 */

import { DEFAULT_COURSE_DATA } from "../constants";

/**
 * Safely extracts a value from multiple possible property names
 * @param {Object} source - Source object
 * @param {string[]} keys - Array of possible property names
 * @param {*} defaultValue - Default value if none found
 * @returns {*} The resolved value
 */
const resolveProperty = (source, keys, defaultValue) => {
  if (!source || typeof source !== "object") return defaultValue;

  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null) {
      return source[key];
    }
  }
  return defaultValue;
};

/**
 * Ensures the value is an array
 * @param {*} value - Value to normalize
 * @param {Array} defaultValue - Default array value
 * @returns {Array} Normalized array
 */
const ensureArray = (value, defaultValue = []) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) return [value];
  return defaultValue;
};

/**
 * Maps raw course data to normalized format
 * @param {Object} rawCourse - Raw course data from API
 * @param {Object} fallbackData - Fallback data for missing fields
 * @returns {Object} Normalized course data
 */
export const mapCourseData = (
  rawCourse,
  fallbackData = DEFAULT_COURSE_DATA,
) => {
  if (!rawCourse) return fallbackData;

  return {
    // Header image with multiple fallbacks
    headerImage: resolveProperty(
      rawCourse,
      ["headerImage", "bannerImage", "coverImage", "thumbnail"],
      fallbackData.headerImage,
    ),

    // Title
    title: resolveProperty(
      rawCourse,
      ["title", "name", "courseName"],
      fallbackData.title,
    ),

    // Tagline/Subtitle
    tagline: resolveProperty(
      rawCourse,
      ["tagline", "subtitle", "shortDescription"],
      fallbackData.tagline,
    ),

    // Rating (normalized to number)
    rating:
      Number(
        resolveProperty(
          rawCourse,
          ["rating", "averageRating"],
          fallbackData.rating,
        ),
      ) || 0,

    // Total ratings count
    totalRatings: resolveProperty(
      rawCourse,
      ["totalRatings", "reviewsCount", "reviewCount", "ratingsCount"],
      fallbackData.totalRatings,
    ),

    // Content counts
    videosCount: resolveProperty(
      rawCourse,
      ["totalLessons", "videosCount", "lessonsCount", "videoCount"],
      fallbackData.videosCount,
    ),

    quizzesCount: resolveProperty(
      rawCourse,
      ["quizzesCount", "assessmentsCount", "quizCount"],
      fallbackData.quizzesCount,
    ),

    pdfCount: resolveProperty(
      rawCourse,
      ["pdfCount", "resourcesCount", "documentsCount"],
      fallbackData.pdfCount,
    ),

    // Description
    description: resolveProperty(
      rawCourse,
      ["description", "longDescription", "fullDescription", "about"],
      fallbackData.description,
    ),

    // Learning objectives (ensure array)
    whatYouWillLearn: ensureArray(
      resolveProperty(
        rawCourse,
        [
          "whatYouWillLearn",
          "WhatYouWillLearn",
          "learningObjectives",
          "objectives",
        ],
        null,
      ),
      fallbackData.whatYouWillLearn,
    ),

    // Target audience (ensure array)
    targetAudience: ensureArray(
      resolveProperty(
        rawCourse,
        ["targetAudience", "whoIsThisFor", "audience", "forWhom"],
        null,
      ),
      fallbackData.targetAudience,
    ),

    // Preserve original subscription status
    isSubscribed: Boolean(rawCourse.isSubscribed),

    // Preserve original ID
    _id: rawCourse._id || rawCourse.id,

    // Extended fields for new design (with graceful fallbacks)

    // Duration
    duration: resolveProperty(
      rawCourse,
      ["duration", "totalDuration", "courseDuration"],
      "",
    ),

    // Skill Level
    skillLevel: resolveProperty(
      rawCourse,
      ["skillLevel", "level", "difficulty"],
      "",
    ),

    // Certificate
    hasCertificate: Boolean(
      resolveProperty(
        rawCourse,
        ["hasCertificate", "certificateIncluded"],
        false,
      ),
    ),

    // Category
    category: resolveProperty(rawCourse, ["category", "courseCategory"], ""),

    // Instructor (extended)
    instructor: rawCourse.instructor
      ? {
          name: rawCourse.instructor.name || "",
          title: rawCourse.instructor.title || "Instructor",
          bio: rawCourse.instructor.bio || "",
          image: rawCourse.instructor.image || "/default-avatar.png",
          achievements: ensureArray(rawCourse.instructor.achievements, []),
          socialLinks: rawCourse.instructor.socialLinks || {},
          studentsCount: rawCourse.instructor.studentsCount,
          coursesCount: rawCourse.instructor.coursesCount,
          rating: rawCourse.instructor.rating,
        }
      : null,

    // Curriculum chapters
    chapters: ensureArray(
      resolveProperty(rawCourse, ["chapters", "curriculum", "modules"], null),
      [],
    ),

    // Reviews
    reviews: ensureArray(
      resolveProperty(rawCourse, ["reviews", "ratings"], null),
      [],
    ),

    // Rating Distribution
    ratingDistribution: resolveProperty(
      rawCourse,
      ["ratingDistribution", "ratingsBreakdown"],
      {},
    ),

    // FAQ
    faq: ensureArray(
      resolveProperty(
        rawCourse,
        ["faq", "faqs", "frequentlyAskedQuestions"],
        null,
      ),
      [],
    ),

    // Highlights (custom course highlights)
    highlights: ensureArray(
      resolveProperty(rawCourse, ["highlights", "features"], null),
      [],
    ),
  };
};

/**
 * Creates course stats array from normalized data
 * @param {Object} courseData - Normalized course data
 * @returns {Array} Array of stat objects
 */
export const createCourseStats = (courseData) => [
  {
    id: "videos",
    count: courseData.videosCount,
    iconSrc: "/video-play.png",
    iconAlt: "Videos",
    label: "Videos",
  },
  {
    id: "quizzes",
    count: courseData.quizzesCount,
    iconSrc: "/document-copy.png",
    iconAlt: "Quizzes",
    label: "Quizzes",
  },
  {
    id: "pdfs",
    count: courseData.pdfCount,
    iconSrc: "/edit.png",
    iconAlt: "PDFs",
    label: "PDFs",
  },
];
