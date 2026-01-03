/**
 * LessonPage Constants
 * Centralized configuration for lesson page
 */

// Animation durations (ms)
export const ANIMATION_DURATIONS = {
  fast: 200,
  normal: 300,
  slow: 500,
  notification: 5000,
};

// Progress thresholds
export const PROGRESS_THRESHOLDS = {
  started: 10,
  halfway: 50,
  almostDone: 90,
  completed: 100,
};

// Video completion threshold (percentage)
export const VIDEO_COMPLETION_THRESHOLD = 90;

// Notification messages
export const MESSAGES = {
  lessonComplete: "Lesson Completed!",
  courseComplete: "🎉 Course Complete! Check your certificate!",
  loginRequired:
    "Please sign in to continue the lesson and track your progress.",
  enrollmentRequired:
    "You need to enroll in this course before you can watch the lessons and track your progress.",
  subscriptionRequired:
    "You need to subscribe to this course to access its lessons.",
};

// Section default states
export const DEFAULT_SECTION_STATE = {
  isExpanded: true,
};

// Progress bar colors
export const PROGRESS_COLORS = {
  inProgress: {
    start: "#48bb78",
    end: "#38a169",
  },
  completed: {
    start: "#667eea",
    end: "#764ba2",
  },
};

// Celebration emojis
export const CELEBRATION_EMOJIS = {
  party: "🎉",
  trophy: "🏆",
  certificate: "📜",
  checkmark: "✅",
  star: "⭐",
};
