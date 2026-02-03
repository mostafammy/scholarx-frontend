/**
 * MarkdownRenderer Component
 *
 * A secure, reusable Markdown rendering component.
 *
 * Security Features:
 * - Whitelist approach: Only safe Markdown elements are allowed
 * - HTML tags are stripped by default (react-markdown behavior)
 * - No raw HTML injection possible
 *
 * SOLID Principles:
 * - SRP: Single responsibility - only renders Markdown
 * - OCP: Extensible via components prop without modification
 * - DIP: Depends on abstractions (ReactMarkdown) not concretions
 *
 * @module MarkdownRenderer
 */

import React, { memo, useMemo } from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import styles from "./MarkdownRenderer.module.css";

/**
 * Allowed elements for security - whitelist approach
 * Only these elements will be rendered, all others stripped
 */
const ALLOWED_ELEMENTS = [
  "p",
  "br",
  "strong",
  "em",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "blockquote",
  "hr",
];

/**
 * Custom component overrides for styling consistency
 * Each component is memoized for performance
 */
const createComponents = (customStyles = {}) => ({
  p: ({ children }) => (
    <p className={customStyles.paragraph || styles.paragraph}>{children}</p>
  ),
  strong: ({ children }) => (
    <strong className={customStyles.bold || styles.bold}>{children}</strong>
  ),
  em: ({ children }) => (
    <em className={customStyles.italic || styles.italic}>{children}</em>
  ),
  ul: ({ children }) => (
    <ul className={customStyles.list || styles.list}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className={customStyles.orderedList || styles.orderedList}>
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className={customStyles.listItem || styles.listItem}>{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className={customStyles.blockquote || styles.blockquote}>
      {children}
    </blockquote>
  ),
  hr: () => <hr className={customStyles.divider || styles.divider} />,
});

/**
 * MarkdownRenderer - Securely renders Markdown content
 *
 * @param {Object} props - Component props
 * @param {string} props.content - Markdown content to render
 * @param {string} props.className - Additional CSS class for wrapper
 * @param {Object} props.customStyles - Custom style overrides for elements
 * @returns {JSX.Element|null} Rendered Markdown or null if no content
 */
const MarkdownRenderer = ({ content, className, customStyles }) => {
  // Early return for empty content
  if (!content || typeof content !== "string") {
    return null;
  }

  // Memoize components to prevent unnecessary re-renders
  const components = useMemo(
    () => createComponents(customStyles),
    [customStyles],
  );

  return (
    <div className={`${styles.markdownContainer} ${className || ""}`}>
      <ReactMarkdown
        components={components}
        allowedElements={ALLOWED_ELEMENTS}
        skipHtml={true} // Security: Never render raw HTML
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

MarkdownRenderer.propTypes = {
  /** Markdown content string to render */
  content: PropTypes.string,
  /** Additional CSS class for the wrapper div */
  className: PropTypes.string,
  /** Custom style class overrides for individual elements */
  customStyles: PropTypes.shape({
    paragraph: PropTypes.string,
    bold: PropTypes.string,
    italic: PropTypes.string,
    list: PropTypes.string,
    orderedList: PropTypes.string,
    listItem: PropTypes.string,
    blockquote: PropTypes.string,
    divider: PropTypes.string,
  }),
};

MarkdownRenderer.defaultProps = {
  content: "",
  className: "",
  customStyles: {},
};

// Memoize component for performance optimization
export default memo(MarkdownRenderer);
