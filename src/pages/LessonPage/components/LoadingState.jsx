/**
 * LoadingState Component
 * Animated loading skeleton for lesson page
 */

import React, { memo } from "react";
import styles from "./LoadingState.module.css";

const LoadingState = memo(function LoadingState() {
  return (
    <div className={styles.container}>
      {/* Left Column - Video Area */}
      <div className={styles.left}>
        <div className={styles.videoSkeleton}>
          <div className={styles.playButton}>
            <div className={styles.playIcon}></div>
          </div>
          <div className={styles.shimmer}></div>
        </div>
        <div className={styles.headerSkeleton}>
          <div className={styles.titleSkeleton}></div>
          <div className={styles.subtitleSkeleton}></div>
        </div>
      </div>

      {/* Right Column - Sidebar */}
      <div className={styles.right}>
        <div className={styles.sidebarSkeleton}>
          <div className={styles.sidebarHeader}></div>
          <div className={styles.progressSkeleton}>
            <div className={styles.progressBar}></div>
          </div>
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className={styles.sectionSkeleton}
              style={{ "--delay": `${index * 0.1}s` }}
            >
              <div className={styles.sectionHeader}></div>
              <div className={styles.lessonsList}>
                {[1, 2].map((_, lessonIndex) => (
                  <div key={lessonIndex} className={styles.lessonItem}>
                    <div className={styles.lessonIcon}></div>
                    <div className={styles.lessonContent}>
                      <div className={styles.lessonTitle}></div>
                    </div>
                    <div className={styles.lessonDuration}></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className={styles.shimmer}></div>
        </div>
      </div>
    </div>
  );
});

export default LoadingState;
