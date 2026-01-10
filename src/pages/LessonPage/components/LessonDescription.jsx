/**
 * LessonDescription Component
 * Shows lesson details, resources, and related info
 */

import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import styles from "./LessonDescription.module.css";

const LessonDescription = memo(function LessonDescription({
  lesson,
  courseTitle,
}) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!lesson) return null;

  const formatDuration = (duration) => {
    if (!duration) return "N/A";
    const minutes = Math.floor(duration);
    const seconds = Math.round((duration - minutes) * 60);
    return `${minutes} min ${seconds > 0 ? `${seconds} sec` : ""}`;
  };

  return (
    <div className={styles.container}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "overview" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("overview")}
        >
          <svg
            className={styles.tabIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Overview
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "resources" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("resources")}
        >
          <svg
            className={styles.tabIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Resources
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "transcript" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("transcript")}
        >
          <svg
            className={styles.tabIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Transcript
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.content}>
        {activeTab === "overview" && (
          <div className={styles.overview}>
            <div className={styles.metaInfo}>
              <div className={styles.metaItem}>
                <svg
                  className={styles.metaIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className={styles.metaLabel}>Duration</span>
                <span className={styles.metaValue}>
                  {formatDuration(lesson.duration)}
                </span>
              </div>
              <div className={styles.metaItem}>
                <svg
                  className={styles.metaIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span className={styles.metaLabel}>Course</span>
                <span className={styles.metaValue}>{courseTitle}</span>
              </div>
            </div>

            {lesson.description ? (
              <div className={styles.description}>
                <h4 className={styles.sectionTitle}>About this lesson</h4>
                <p className={styles.descriptionText}>{lesson.description}</p>
              </div>
            ) : (
              <div className={styles.emptyState}>
                <svg
                  className={styles.emptyIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p>No description available for this lesson.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "resources" && (
          <div className={styles.resources}>
            {lesson.resources && lesson.resources.length > 0 ? (
              <div className={styles.resourcesList}>
                {lesson.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.resourceItem}
                  >
                    <svg
                      className={styles.resourceIcon}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <div className={styles.resourceInfo}>
                      <span className={styles.resourceName}>
                        {resource.name || resource.title}
                      </span>
                      <span className={styles.resourceType}>
                        {resource.type || "File"}
                      </span>
                    </div>
                    <svg
                      className={styles.downloadIcon}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <svg
                  className={styles.emptyIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
                <p>No resources available for this lesson.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "transcript" && (
          <div className={styles.transcript}>
            {lesson.transcript ? (
              <div className={styles.transcriptContent}>
                <p>{lesson.transcript}</p>
              </div>
            ) : (
              <div className={styles.emptyState}>
                <svg
                  className={styles.emptyIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                <p>Transcript not available for this lesson.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

LessonDescription.propTypes = {
  lesson: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    duration: PropTypes.number,
    resources: PropTypes.array,
    transcript: PropTypes.string,
  }),
  courseTitle: PropTypes.string,
};

export default LessonDescription;
