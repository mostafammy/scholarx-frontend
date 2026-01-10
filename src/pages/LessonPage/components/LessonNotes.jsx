/**
 * LessonNotes Component
 * Allows users to take notes for each lesson
 * Notes are saved to localStorage
 */

import React, { memo, useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./LessonNotes.module.css";

const LessonNotes = memo(function LessonNotes({
  lessonId,
  courseId,
  isExpanded,
  onToggle,
}) {
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const textareaRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // Storage key for this lesson's notes
  const storageKey = `lesson_notes_${courseId}_${lessonId}`;

  // Load notes from localStorage
  useEffect(() => {
    if (lessonId && courseId) {
      const savedNotes = localStorage.getItem(storageKey);
      if (savedNotes) {
        setNotes(savedNotes);
      } else {
        setNotes("");
      }
    }
  }, [lessonId, courseId, storageKey]);

  // Auto-save with debounce
  const saveNotes = useCallback(
    (value) => {
      setIsSaving(true);

      // Clear previous timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Debounced save
      saveTimeoutRef.current = setTimeout(() => {
        localStorage.setItem(storageKey, value);
        setIsSaving(false);
        setLastSaved(new Date());
      }, 500);
    },
    [storageKey]
  );

  const handleNotesChange = useCallback(
    (e) => {
      const value = e.target.value;
      setNotes(value);
      saveNotes(value);
    },
    [saveNotes]
  );

  const handleClearNotes = useCallback(() => {
    if (
      window.confirm(
        "Are you sure you want to clear all notes for this lesson?"
      )
    ) {
      setNotes("");
      localStorage.removeItem(storageKey);
      setLastSaved(null);
    }
  }, [storageKey]);

  const handleCopyNotes = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(notes);
      // Could show a toast notification here
    } catch (err) {
      console.error("Failed to copy notes:", err);
    }
  }, [notes]);

  // Format last saved time
  const formatLastSaved = () => {
    if (!lastSaved) return null;
    const now = new Date();
    const diff = Math.floor((now - lastSaved) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return lastSaved.toLocaleTimeString();
  };

  return (
    <div className={`${styles.container} ${isExpanded ? styles.expanded : ""}`}>
      {/* Header - Always visible */}
      <button
        className={styles.header}
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <div className={styles.headerLeft}>
          <svg
            className={styles.noteIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <span className={styles.headerTitle}>Lesson Notes</span>
          {notes.length > 0 && (
            <span className={styles.noteBadge}>
              {notes.split(/\s+/).filter(Boolean).length} words
            </span>
          )}
        </div>
        <div className={styles.headerRight}>
          {isSaving && (
            <span className={styles.savingIndicator}>Saving...</span>
          )}
          {!isSaving && lastSaved && (
            <span className={styles.savedIndicator}>
              <svg
                className={styles.checkIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Saved {formatLastSaved()}
            </span>
          )}
          <svg
            className={`${styles.chevron} ${isExpanded ? styles.rotated : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Notes Content */}
      {isExpanded && (
        <div className={styles.content}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={notes}
            onChange={handleNotesChange}
            placeholder="Take notes while watching... Your notes are automatically saved locally."
            rows={6}
            aria-label="Lesson notes"
          />

          <div className={styles.actions}>
            <button
              className={styles.actionButton}
              onClick={handleCopyNotes}
              disabled={!notes}
              title="Copy notes to clipboard"
            >
              <svg
                className={styles.actionIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy
            </button>
            <button
              className={`${styles.actionButton} ${styles.dangerButton}`}
              onClick={handleClearNotes}
              disabled={!notes}
              title="Clear all notes"
            >
              <svg
                className={styles.actionIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

LessonNotes.propTypes = {
  lessonId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  isExpanded: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
};

export default LessonNotes;
