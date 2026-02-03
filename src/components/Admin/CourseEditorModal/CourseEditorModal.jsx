/**
 * CourseEditorModal - Premium Course Editor Component
 *
 * World-class admin experience for creating and editing courses.
 *
 * Architecture:
 * - SRP: Each tab handles one concern
 * - OCP: New tabs can be added without modifying core logic
 * - DIP: Tab content abstracted through configuration
 *
 * @module CourseEditorModal
 */

import React, { useState, useCallback, useMemo, memo } from "react";
import PropTypes from "prop-types";
import {
  FaBook,
  FaFileAlt,
  FaDollarSign,
  FaImage,
  FaUsers,
  FaCog,
  FaTimes,
  FaEye,
  FaSave,
  FaCheck,
  FaSpinner,
} from "react-icons/fa";
import MarkdownEditor from "../../common/MarkdownEditor";
import MarkdownRenderer from "../../common/MarkdownRenderer";
import styles from "./CourseEditorModal.module.css";

/**
 * Tab Configuration - Extensible via OCP
 */
const TABS = [
  { id: "basic", label: "Basic Info", icon: FaBook },
  { id: "content", label: "Content", icon: FaFileAlt },
  { id: "pricing", label: "Pricing", icon: FaDollarSign },
  { id: "media", label: "Media", icon: FaImage },
  { id: "audience", label: "Audience", icon: FaUsers },
  { id: "settings", label: "Settings", icon: FaCog },
];

/**
 * Calculate form completion percentage
 */
const calculateProgress = (course) => {
  const fields = [
    { key: "title", weight: 20 },
    { key: "description", weight: 25 },
    { key: "category", weight: 10 },
    {
      key: "currentPrice",
      weight: 15,
      check: (v) => v !== undefined && v !== "",
    },
    { key: "image", weight: 15, check: (v) => v?.url || v?.file },
    { key: "instructor", weight: 15 },
  ];

  let completed = 0;
  fields.forEach((field) => {
    const value = course[field.key];
    const isComplete = field.check
      ? field.check(value)
      : value !== undefined && value !== "" && value !== null;
    if (isComplete) completed += field.weight;
  });

  return Math.min(100, completed);
};

/**
 * CourseEditorModal Component
 */
const CourseEditorModal = ({
  isOpen,
  onClose,
  course,
  onChange,
  onSubmit,
  isLoading,
  mode, // 'create' | 'edit'
  instructors = [],
}) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [showPreview, setShowPreview] = useState(false);

  // Calculate progress
  const progress = useMemo(() => calculateProgress(course), [course]);

  // Handle field change
  const handleChange = useCallback(
    (field, value) => {
      onChange({ ...course, [field]: value });
    },
    [course, onChange],
  );

  // Handle image change
  const handleImageChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        handleChange("image", { file, preview: URL.createObjectURL(file) });
      }
    },
    [handleChange],
  );

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button
              type="button"
              className={styles.backBtn}
              onClick={onClose}
              aria-label="Close editor"
            >
              <FaTimes />
              <span>Close</span>
            </button>
            <h1 className={styles.title}>
              {mode === "create" ? "Create New Course" : "Edit Course"}
            </h1>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={`${styles.previewBtn} ${showPreview ? styles.active : ""}`}
              onClick={() => setShowPreview(!showPreview)}
            >
              <FaEye />
              <span>Preview</span>
            </button>
            <button
              type="button"
              className={styles.saveBtn}
              onClick={onSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FaSpinner className={styles.spin} />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>{mode === "create" ? "Create" : "Save Changes"}</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className={styles.content}>
          {/* Sidebar Navigation */}
          <nav className={styles.sidebar}>
            <div className={styles.tabList}>
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className={styles.tabIcon} />
                  <span className={styles.tabLabel}>{tab.label}</span>
                  {activeTab === tab.id && (
                    <span className={styles.activeIndicator} />
                  )}
                </button>
              ))}
            </div>

            {/* Progress Indicator */}
            <div className={styles.progressSection}>
              <div className={styles.progressHeader}>
                <span>Completion</span>
                <span className={styles.progressPercent}>{progress}%</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                />
              </div>
              {progress === 100 && (
                <div className={styles.progressComplete}>
                  <FaCheck /> Ready to publish
                </div>
              )}
            </div>
          </nav>

          {/* Form Area */}
          <main className={styles.formArea}>
            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <div className={styles.tabContent}>
                <div className={styles.sectionHeader}>
                  <h2>Basic Information</h2>
                  <p>Essential details about your course</p>
                </div>

                <div className={styles.formCard}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Course Title <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      className={styles.input}
                      value={course.title || ""}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="e.g., Complete Web Development Bootcamp"
                      maxLength={100}
                    />
                    <span className={styles.charCount}>
                      {(course.title || "").length}/100
                    </span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Category <span className={styles.required}>*</span>
                      </label>
                      <select
                        className={styles.select}
                        value={course.category || ""}
                        onChange={(e) =>
                          handleChange("category", e.target.value)
                        }
                      >
                        <option value="">Select category</option>
                        <option value="Featured">Featured</option>
                        <option value="ScholarX">ScholarX</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Instructor</label>
                      <select
                        className={styles.select}
                        value={course.instructor || ""}
                        onChange={(e) =>
                          handleChange("instructor", e.target.value)
                        }
                      >
                        <option value="">Select instructor</option>
                        {instructors.map((inst) => (
                          <option key={inst._id} value={inst._id}>
                            {inst.firstName} {inst.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Status</label>
                    <div className={styles.statusToggle}>
                      <button
                        type="button"
                        className={`${styles.statusBtn} ${course.status === "active" ? styles.activeStatus : ""}`}
                        onClick={() => handleChange("status", "active")}
                      >
                        <span className={styles.statusDot} />
                        Active
                      </button>
                      <button
                        type="button"
                        className={`${styles.statusBtn} ${course.status === "inactive" ? styles.inactiveStatus : ""}`}
                        onClick={() => handleChange("status", "inactive")}
                      >
                        <span className={styles.statusDot} />
                        Inactive
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content Tab */}
            {activeTab === "content" && (
              <div className={styles.tabContent}>
                <div className={styles.sectionHeader}>
                  <h2>Course Content</h2>
                  <p>Describe what students will learn</p>
                </div>

                <div className={styles.formCard}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Description <span className={styles.required}>*</span>
                    </label>
                    <MarkdownEditor
                      value={course.description || ""}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      placeholder="Write a compelling course description..."
                      minHeight="300px"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === "pricing" && (
              <div className={styles.tabContent}>
                <div className={styles.sectionHeader}>
                  <h2>Pricing</h2>
                  <p>Set the course price and enrollment options</p>
                </div>

                <div className={styles.formCard}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Current Price (EGP){" "}
                        <span className={styles.required}>*</span>
                      </label>
                      <div className={styles.priceInput}>
                        <span className={styles.currency}>EGP</span>
                        <input
                          type="number"
                          className={styles.input}
                          value={course.currentPrice || ""}
                          onChange={(e) =>
                            handleChange(
                              "currentPrice",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Old Price (EGP)</label>
                      <div className={styles.priceInput}>
                        <span className={styles.currency}>EGP</span>
                        <input
                          type="number"
                          className={styles.input}
                          value={course.oldPrice || ""}
                          onChange={(e) =>
                            handleChange(
                              "oldPrice",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <span className={styles.hint}>
                        Set to show a discount badge
                      </span>
                    </div>
                  </div>

                  {course.oldPrice > course.currentPrice && (
                    <div className={styles.discountBadge}>
                      🎉{" "}
                      {Math.round(
                        (1 - course.currentPrice / course.oldPrice) * 100,
                      )}
                      % discount will be shown
                    </div>
                  )}

                  <div className={styles.formGroup}>
                    <label className={styles.toggleLabel}>
                      <input
                        type="checkbox"
                        checked={course.requiresForm || false}
                        onChange={(e) =>
                          handleChange("requiresForm", e.target.checked)
                        }
                        className={styles.checkbox}
                      />
                      <span className={styles.toggleSlider} />
                      <div className={styles.toggleText}>
                        <strong>Require Application Form</strong>
                        <span>Users must fill out a form before enrolling</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Media Tab */}
            {activeTab === "media" && (
              <div className={styles.tabContent}>
                <div className={styles.sectionHeader}>
                  <h2>Media</h2>
                  <p>Upload course images and preview video</p>
                </div>

                <div className={styles.formCard}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Course Image</label>
                    <div className={styles.imageUpload}>
                      {course.image?.preview || course.image?.url ? (
                        <div className={styles.imagePreview}>
                          <img
                            src={course.image.preview || course.image.url}
                            alt="Course preview"
                          />
                          <button
                            type="button"
                            className={styles.removeImage}
                            onClick={() => handleChange("image", null)}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <label className={styles.uploadArea}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className={styles.fileInput}
                          />
                          <FaImage className={styles.uploadIcon} />
                          <span>Click to upload or drag and drop</span>
                          <span className={styles.uploadHint}>
                            PNG, JPG up to 5MB (16:9 recommended)
                          </span>
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Audience Tab */}
            {activeTab === "audience" && (
              <div className={styles.tabContent}>
                <div className={styles.sectionHeader}>
                  <h2>Target Audience</h2>
                  <p>Define who this course is for</p>
                </div>

                <div className={styles.formCard}>
                  <div className={styles.comingSoon}>
                    <span>🚀</span>
                    <h3>Coming Soon</h3>
                    <p>
                      Target audience, skill level, and language settings will
                      be available in the next update.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className={styles.tabContent}>
                <div className={styles.sectionHeader}>
                  <h2>Advanced Settings</h2>
                  <p>Additional course configuration</p>
                </div>

                <div className={styles.formCard}>
                  <div className={styles.comingSoon}>
                    <span>⚙️</span>
                    <h3>Coming Soon</h3>
                    <p>
                      Slug customization, SEO settings, and advanced options
                      will be available soon.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* Live Preview Panel */}
          {showPreview && (
            <aside className={styles.previewPanel}>
              <div className={styles.previewHeader}>
                <h3>Live Preview</h3>
              </div>
              <div className={styles.previewContent}>
                <div className={styles.previewCard}>
                  {(course.image?.preview || course.image?.url) && (
                    <img
                      src={course.image.preview || course.image.url}
                      alt="Course"
                      className={styles.previewImage}
                    />
                  )}
                  <div className={styles.previewBody}>
                    <span className={styles.previewCategory}>
                      {course.category || "Category"}
                    </span>
                    <h4>{course.title || "Course Title"}</h4>
                    <div className={styles.previewPrice}>
                      {course.oldPrice > course.currentPrice && (
                        <span className={styles.oldPrice}>
                          EGP {course.oldPrice}
                        </span>
                      )}
                      <span className={styles.currentPrice}>
                        EGP {course.currentPrice || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {course.description && (
                  <div className={styles.previewDescription}>
                    <h5>Description</h5>
                    <MarkdownRenderer content={course.description} />
                  </div>
                )}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

CourseEditorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  course: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  mode: PropTypes.oneOf(["create", "edit"]).isRequired,
  instructors: PropTypes.array,
};

CourseEditorModal.defaultProps = {
  isLoading: false,
  instructors: [],
};

export default memo(CourseEditorModal);
