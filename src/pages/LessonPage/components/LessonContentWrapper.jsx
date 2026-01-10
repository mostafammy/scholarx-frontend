/**
 * LessonContentWrapper Component
 * Single source of truth for lesson content sizing (Video Player / Empty State)
 *
 * Architecture: This wrapper handles ALL responsive sizing logic,
 * allowing child components (VideoPlayer, EmptyLessonState) to simply fill 100%.
 *
 * Benefits:
 * - Single Responsibility: Sizing logic lives in one place
 * - Open/Closed: Easy to extend with new content types
 * - DRY: No duplicate responsive breakpoints across components
 * - Maintainable: Change sizing in one file, affects all children
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import styles from "./LessonContentWrapper.module.css";

const LessonContentWrapper = memo(function LessonContentWrapper({
  children,
  className = "",
  isTheaterMode = false,
}) {
  return (
    <div
      className={`${styles.wrapper} ${
        isTheaterMode ? styles.theaterMode : ""
      } ${className}`.trim()}
    >
      <div className={styles.aspectContainer}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
});

LessonContentWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  isTheaterMode: PropTypes.bool,
};

export default LessonContentWrapper;
