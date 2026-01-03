/**
 * EmptyLessonState Component
 * Displayed when no lesson is currently selected
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import styles from "./EmptyLessonState.module.css";

const EmptyLessonState = memo(function EmptyLessonState({ courseName }) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Animated Icon */}
        <div className={styles.iconWrapper}>
          <div className={styles.iconBg}></div>
          <span className={styles.icon}>🎬</span>
          <div className={styles.pulseRing}></div>
          <div
            className={styles.pulseRing}
            style={{ animationDelay: "0.5s" }}
          ></div>
        </div>

        {/* Text Content */}
        <h2 className={styles.title}>Ready to Learn?</h2>
        <p className={styles.subtitle}>
          {courseName ? (
            <>
              Welcome to <strong>{courseName}</strong>
            </>
          ) : (
            "Welcome to your course"
          )}
        </p>
        <p className={styles.description}>
          Select a lesson from the sidebar to start watching
        </p>

        {/* Arrow Animation pointing to sidebar */}
        <div className={styles.arrowHint}>
          <span className={styles.arrowText}>Choose a lesson</span>
          <div className={styles.arrowIcon}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Features List */}
        <div className={styles.features}>
          <div className={styles.featureItem}>
            <span className={styles.featureIcon}>📚</span>
            <span className={styles.featureText}>Track your progress</span>
          </div>
          <div className={styles.featureItem}>
            <span className={styles.featureIcon}>🏆</span>
            <span className={styles.featureText}>Earn certificates</span>
          </div>
          <div className={styles.featureItem}>
            <span className={styles.featureIcon}>🎯</span>
            <span className={styles.featureText}>Learn at your pace</span>
          </div>
        </div>
      </div>
    </div>
  );
});

EmptyLessonState.propTypes = {
  courseName: PropTypes.string,
};

export default EmptyLessonState;
