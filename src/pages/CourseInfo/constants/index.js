/**
 * CourseInfo Constants
 * Centralized configuration for the CourseInfo module
 */

// Default fallback values for course data
export const DEFAULT_COURSE_DATA = {
  headerImage: "/Hero Section.png",
  title: "Course Title",
  tagline: "Course description goes here",
  rating: 0,
  totalRatings: 0,
  videosCount: 0,
  quizzesCount: 0,
  pdfCount: 0,
  description: "",
  whatYouWillLearn: [],
  targetAudience: [],
};

// Rating configuration
export const RATING_CONFIG = {
  MAX_STARS: 5,
  STAR_SIZE: {
    default: 24,
    tablet: 20,
    mobile: 18,
    smallMobile: 16,
  },
};

// Stat item icons mapping
export const STAT_ICONS = {
  videos: {
    src: "/video-play.png",
    alt: "Videos",
    label: "Videos",
  },
  quizzes: {
    src: "/document-copy.png",
    alt: "Quizzes",
    label: "Quizzes",
  },
  pdfs: {
    src: "/edit.png",
    alt: "PDFs",
    label: "PDFs",
  },
};

// Section icons mapping
export const SECTION_ICONS = {
  description: {
    src: "/course-description.png",
    alt: "Course Description Icon",
  },
  learning: {
    src: "/learn.png",
    alt: "Learning Icon",
  },
  audience: {
    src: "/target.png",
    alt: "Target Audience Icon",
  },
};

// Loading states
export const LOADING_STATES = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};
