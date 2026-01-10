/**
 * useLessonNavigation Hook
 * Manages lesson navigation, auto-play, and theater mode
 */

import { useState, useCallback, useMemo, useEffect } from "react";

/**
 * Custom hook for lesson navigation
 * @param {Array} sections - Course sections with lessons
 * @param {Object} currentLesson - Currently selected lesson
 * @param {Function} selectLesson - Function to select a lesson
 * @returns {Object} Navigation state and actions
 */
export const useLessonNavigation = (sections, currentLesson, selectLesson) => {
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [showAutoPlay, setShowAutoPlay] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  
  // Initialize playback speed from localStorage synchronously to avoid race conditions
  const [playbackSpeed, setPlaybackSpeed] = useState(() => {
    if (typeof window === "undefined") return 1;
    const saved = localStorage.getItem("preferred_playback_speed");
    if (saved) {
      const parsed = parseFloat(saved);
      // Validate it's a valid speed option
      const validSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
      if (validSpeeds.includes(parsed)) {
        return parsed;
      }
    }
    return 1; // Default to 1x speed
  });

  // Flatten all lessons for navigation
  const allLessons = useMemo(() => {
    const lessons = [];
    sections.forEach((section) => {
      section.lessons.forEach((lesson) => {
        lessons.push(lesson);
      });
    });
    return lessons;
  }, [sections]);

  // Find current lesson index
  const currentIndex = useMemo(() => {
    if (!currentLesson) return -1;
    return allLessons.findIndex((l) => l._id === currentLesson._id);
  }, [allLessons, currentLesson]);

  // Navigation checks
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allLessons.length - 1;

  // Get previous lesson
  const previousLesson = useMemo(() => {
    if (!hasPrevious) return null;
    return allLessons[currentIndex - 1];
  }, [allLessons, currentIndex, hasPrevious]);

  // Get next lesson
  const nextLesson = useMemo(() => {
    if (!hasNext) return null;
    return allLessons[currentIndex + 1];
  }, [allLessons, currentIndex, hasNext]);

  // Navigate to previous lesson
  const goToPreviousLesson = useCallback(() => {
    if (previousLesson) {
      selectLesson(previousLesson);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [previousLesson, selectLesson]);

  // Navigate to next lesson
  const goToNextLesson = useCallback(() => {
    if (nextLesson) {
      selectLesson(nextLesson);
      setShowAutoPlay(false);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [nextLesson, selectLesson]);

  // Toggle theater mode
  const toggleTheaterMode = useCallback(() => {
    setIsTheaterMode((prev) => !prev);
  }, []);

  // Toggle sidebar visibility
  const toggleSidebar = useCallback(() => {
    setIsSidebarVisible((prev) => !prev);
  }, []);

  // Show auto-play overlay
  const triggerAutoPlay = useCallback(() => {
    if (hasNext) {
      setShowAutoPlay(true);
    }
  }, [hasNext]);

  // Cancel auto-play
  const cancelAutoPlay = useCallback(() => {
    setShowAutoPlay(false);
  }, []);

  // Change playback speed
  const changePlaybackSpeed = useCallback((speed) => {
    setPlaybackSpeed(speed);
    // Store preference in localStorage
    localStorage.setItem("preferred_playback_speed", speed.toString());
  }, []);

  // Note: localStorage loading is done synchronously in useState initializer above
  // to avoid race conditions with video player initialization

  // Close sidebar on mobile when lesson changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarVisible(false);
    }
  }, [currentLesson]);

  // Handle escape key for theater mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && showAutoPlay) {
        cancelAutoPlay();
      }
      if (e.key === " " && showAutoPlay) {
        e.preventDefault();
        goToNextLesson();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showAutoPlay, cancelAutoPlay, goToNextLesson]);

  return {
    // State
    isTheaterMode,
    showAutoPlay,
    isSidebarVisible,
    playbackSpeed,
    hasPrevious,
    hasNext,
    previousLesson,
    nextLesson,
    allLessons,
    currentIndex,
    // Actions
    goToPreviousLesson,
    goToNextLesson,
    toggleTheaterMode,
    toggleSidebar,
    triggerAutoPlay,
    cancelAutoPlay,
    changePlaybackSpeed,
    setIsSidebarVisible,
  };
};
