/**
 * MarkdownEditor Component
 *
 * A user-friendly, visually appealing Markdown editor for non-technical admins.
 *
 * Features:
 * - Formatting toolbar with intuitive icons
 * - Live preview panel
 * - Insert formatting at cursor position
 * - Premium glassmorphism styling
 *
 * SOLID Principles:
 * - SRP: Single responsibility - Markdown editing
 * - OCP: Extensible via toolbar configuration
 *
 * @module MarkdownEditor
 */

import React, { useState, useRef, useCallback, memo } from "react";
import PropTypes from "prop-types";
import {
  FaBold,
  FaItalic,
  FaListUl,
  FaListOl,
  FaParagraph,
  FaEye,
  FaEyeSlash,
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
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef(null);

  /**
   * Insert formatting at cursor position or wrap selected text
   */
  const insertFormatting = useCallback(
    (button) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const { selectionStart, selectionEnd } = textarea;
      const selectedText = value.substring(selectionStart, selectionEnd);
      const textToInsert = selectedText || button.placeholder;

      const newValue =
        value.substring(0, selectionStart) +
        button.prefix +
        textToInsert +
        button.suffix +
        value.substring(selectionEnd);

      onChange({ target: { value: newValue } });

      // Restore focus and set cursor position
      setTimeout(() => {
        textarea.focus();
        const newCursorPos =
          selectionStart +
          button.prefix.length +
          (selectedText ? selectedText.length : button.placeholder.length);
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
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

  return (
    <div className={styles.editorContainer}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarButtons}>
          {TOOLBAR_BUTTONS.map((button) => (
            <button
              key={button.id}
              type="button"
              className={styles.toolbarBtn}
              onClick={() => insertFormatting(button)}
              title={button.tooltip}
              aria-label={button.tooltip}
            >
              <button.icon />
            </button>
          ))}
        </div>

        <button
          type="button"
          className={`${styles.previewToggle} ${showPreview ? styles.active : ""}`}
          onClick={() => setShowPreview(!showPreview)}
          title={showPreview ? "Hide Preview" : "Show Preview"}
        >
          {showPreview ? <FaEyeSlash /> : <FaEye />}
          <span>{showPreview ? "Hide Preview" : "Preview"}</span>
        </button>
      </div>

      {/* Editor Area */}
      <div
        className={`${styles.editorArea} ${showPreview ? styles.splitView : ""}`}
      >
        <div className={styles.textareaWrapper}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            required={required}
            className={styles.textarea}
            style={{ minHeight }}
          />
        </div>

        {/* Live Preview */}
        {showPreview && (
          <div className={styles.previewPanel}>
            <div className={styles.previewHeader}>
              <span>Live Preview</span>
            </div>
            <div className={styles.previewContent}>
              {value ? (
                <MarkdownRenderer content={value} />
              ) : (
                <p className={styles.previewPlaceholder}>
                  Start typing to see preview...
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Help text */}
      <div className={styles.helpText}>
        <span>💡 Tip: Select text and click a button to format it</span>
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
  minHeight: "150px",
  required: false,
};

export default memo(MarkdownEditor);
