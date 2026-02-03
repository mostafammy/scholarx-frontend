/**
 * MarkdownEditor Component
 *
 * A user-friendly, visually appealing Markdown editor for non-technical admins.
 *
 * Features:
 * - Formatting toolbar with intuitive icons
 * - Always-visible live preview panel
 * - Insert formatting at cursor position (with scroll preservation)
 * - Premium glassmorphism styling
 *
 * SOLID Principles:
 * - SRP: Single responsibility - Markdown editing
 * - OCP: Extensible via toolbar configuration
 *
 * @module MarkdownEditor
 */

import React, { useRef, useCallback, memo } from "react";
import PropTypes from "prop-types";
import {
  FaBold,
  FaItalic,
  FaListUl,
  FaListOl,
  FaParagraph,
} from "react-icons/fa";
import MarkdownRenderer from "../MarkdownRenderer";
import styles from "./MarkdownEditor.module.css";

/**
 * Toolbar button configuration
 * Each button has an icon, tooltip, and function to insert formatting
 */
const TOOLBAR_BUTTONS = [
  {
    id: "bold",
    icon: FaBold,
    tooltip: "Bold (Ctrl+B)",
    prefix: "**",
    suffix: "**",
    placeholder: "bold text",
  },
  {
    id: "italic",
    icon: FaItalic,
    tooltip: "Italic (Ctrl+I)",
    prefix: "*",
    suffix: "*",
    placeholder: "italic text",
  },
  {
    id: "bulletList",
    icon: FaListUl,
    tooltip: "Bullet List",
    prefix: "\n- ",
    suffix: "",
    placeholder: "list item",
  },
  {
    id: "numberedList",
    icon: FaListOl,
    tooltip: "Numbered List",
    prefix: "\n1. ",
    suffix: "",
    placeholder: "list item",
  },
  {
    id: "paragraph",
    icon: FaParagraph,
    tooltip: "New Paragraph",
    prefix: "\n\n",
    suffix: "",
    placeholder: "",
  },
];

/**
 * MarkdownEditor - Rich text editing with Markdown
 */
const MarkdownEditor = ({
  value,
  onChange,
  placeholder,
  minHeight,
  required,
}) => {
  const textareaRef = useRef(null);
  // Track selection state persistently
  const selectionStateRef = useRef({ start: 0, end: 0, scrollTop: 0 });

  /**
   * Save selection and scroll state before blur
   */
  const saveSelectionState = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      selectionStateRef.current = {
        start: textarea.selectionStart,
        end: textarea.selectionEnd,
        scrollTop: textarea.scrollTop,
      };
    }
  }, []);

  /**
   * Insert formatting at cursor position or wrap selected text
   * FIXED: Preserves scroll position
   */
  const insertFormatting = useCallback(
    (button) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      // Use saved selection state (from onBlur or current)
      const { start, end, scrollTop } = selectionStateRef.current;
      const selectionStart =
        textarea.selectionStart !== undefined ? textarea.selectionStart : start;
      const selectionEnd =
        textarea.selectionEnd !== undefined ? textarea.selectionEnd : end;
      const savedScrollTop = textarea.scrollTop || scrollTop;

      const selectedText = value.substring(selectionStart, selectionEnd);
      const textToInsert = selectedText || button.placeholder;

      const newValue =
        value.substring(0, selectionStart) +
        button.prefix +
        textToInsert +
        button.suffix +
        value.substring(selectionEnd);

      // Calculate new cursor position
      const newCursorPos =
        selectionStart +
        button.prefix.length +
        textToInsert.length +
        button.suffix.length;

      // Update value
      onChange({ target: { value: newValue } });

      // Restore focus, cursor, and scroll position
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.scrollTop = savedScrollTop;
      });
    },
    [value, onChange],
  );

  /**
   * Handle keyboard shortcuts
   */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "b") {
          e.preventDefault();
          insertFormatting(TOOLBAR_BUTTONS[0]); // Bold
        } else if (e.key === "i") {
          e.preventDefault();
          insertFormatting(TOOLBAR_BUTTONS[1]); // Italic
        }
      }
    },
    [insertFormatting],
  );

  /**
   * Prevent default on toolbar button mousedown to keep textarea focused
   */
  const handleToolbarMouseDown = useCallback((e) => {
    e.preventDefault();
  }, []);

  return (
    <div className={styles.editorContainer}>
      {/* Header with title and toolbar */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.editorLabel}>✍️ Editor</span>
          <span className={styles.previewLabel}>👁️ Live Preview</span>
        </div>
        <div className={styles.toolbar}>
          {TOOLBAR_BUTTONS.map((button) => (
            <button
              key={button.id}
              type="button"
              className={styles.toolbarBtn}
              onMouseDown={handleToolbarMouseDown}
              onClick={() => insertFormatting(button)}
              title={button.tooltip}
              aria-label={button.tooltip}
            >
              <button.icon />
            </button>
          ))}
        </div>
      </div>

      {/* Split Editor Area - Always shows both editor and preview */}
      <div className={styles.splitEditorArea}>
        {/* Left: Editor */}
        <div className={styles.editorPane}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            onBlur={saveSelectionState}
            onSelect={saveSelectionState}
            placeholder={placeholder}
            required={required}
            className={styles.textarea}
            style={{ minHeight }}
          />
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Right: Live Preview */}
        <div className={styles.previewPane}>
          <div className={styles.previewContent}>
            {value ? (
              <MarkdownRenderer content={value} />
            ) : (
              <p className={styles.previewPlaceholder}>
                Start typing to see your formatted description...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer with tips */}
      <div className={styles.footer}>
        <span className={styles.tip}>
          💡 <strong>Tip:</strong> Select text, then click{" "}
          <FaBold className={styles.inlineIcon} /> or{" "}
          <FaItalic className={styles.inlineIcon} /> to format
        </span>
        <span className={styles.shortcuts}>
          <kbd>Ctrl</kbd>+<kbd>B</kbd> Bold &nbsp;|&nbsp; <kbd>Ctrl</kbd>+
          <kbd>I</kbd> Italic
        </span>
      </div>
    </div>
  );
};

MarkdownEditor.propTypes = {
  /** Current value of the editor */
  value: PropTypes.string.isRequired,
  /** Change handler - receives event with target.value */
  onChange: PropTypes.func.isRequired,
  /** Placeholder text */
  placeholder: PropTypes.string,
  /** Minimum height of textarea */
  minHeight: PropTypes.string,
  /** Whether field is required */
  required: PropTypes.bool,
};

MarkdownEditor.defaultProps = {
  placeholder: "Write your description here...",
  minHeight: "200px",
  required: false,
};

export default memo(MarkdownEditor);
