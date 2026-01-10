/**
 * KeyboardShortcuts Component
 * Help overlay showing available keyboard shortcuts
 */

import React, { memo, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./KeyboardShortcuts.module.css";

const shortcuts = [
  { keys: ["Shift", "←"], action: "Previous lesson" },
  { keys: ["Shift", "→"], action: "Next lesson" },
  { keys: ["Shift", "T"], action: "Toggle theater mode" },
  { keys: ["Space"], action: "Play/Pause video" },
  { keys: ["Esc"], action: "Exit theater mode / Close overlay" },
  { keys: ["?"], action: "Show this help" },
];

const KeyboardShortcuts = memo(function KeyboardShortcuts({
  isVisible,
  onClose,
}) {
  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isVisible) {
        onClose();
      }
    };

    if (isVisible) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <svg
              className={styles.icon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Keyboard Shortcuts
          </h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className={styles.shortcutsList}>
          {shortcuts.map((shortcut, index) => (
            <div key={index} className={styles.shortcutItem}>
              <div className={styles.keys}>
                {shortcut.keys.map((key, keyIndex) => (
                  <React.Fragment key={keyIndex}>
                    <kbd className={styles.key}>{key}</kbd>
                    {keyIndex < shortcut.keys.length - 1 && (
                      <span className={styles.plus}>+</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <span className={styles.action}>{shortcut.action}</span>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <p>
            Press <kbd className={styles.key}>Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
});

KeyboardShortcuts.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default KeyboardShortcuts;
