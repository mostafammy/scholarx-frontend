/**
 * Courses Module Constants
 * Centralized configuration for the Courses module
 */

// Course section types
export const COURSE_SECTIONS = {
  LATEST: "latest",
  FEATURED: "featured",
  SCHOLARX: "scholarx",
  SEARCH: "search",
};

// Badge configurations
export const BADGE_CONFIG = {
  [COURSE_SECTIONS.LATEST]: {
    label: "New",
    className: "badgeNew",
  },
  [COURSE_SECTIONS.FEATURED]: {
    label: "Featured",
    className: "badgeFeatured",
  },
  [COURSE_SECTIONS.SCHOLARX]: {
    label: "ScholarX",
    className: "badgeScholarx",
  },
};

// Default course values
export const DEFAULT_COURSE_VALUES = {
  title: "Course Title",
  category: "Category",
  hours: 0,
  lectures: 0,
  price: 0,
  oldPrice: 0,
  instructor: "Instructor",
  reviews: 0,
  rating: 0,
};

// New course threshold (days)
export const NEW_COURSE_THRESHOLD_DAYS = 7;

// Pagination config
export const PAGINATION_CONFIG = {
  ITEMS_PER_PAGE: 6,
};

// Animation durations (in ms)
export const ANIMATION_DURATIONS = {
  CARD_HOVER: 300,
  SKELETON_SHIMMER: 1500,
  FADE_IN: 400,
  STAGGER_DELAY: 100,
};

// Skeleton loading delay (simulate network)
export const SKELETON_DISPLAY_TIME = 800;
