/**
 * AccessDenied Component
 * Displays various access restriction states
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AccessDenied.module.css";

const AccessDenied = memo(function AccessDenied({
  type,
  courseId,
  // Reserved for future blocked user state expansion
  // blockReason,
  // blockedAt,
}) {
  const navigate = useNavigate();

  const configs = {
    login: {
      icon: "🔐",
      title: "Log In Required",
      message: "Please sign in to continue the lesson and track your progress.",
      actionText: "Go to Login",
      actionPath: "/login",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    enrollment: {
      icon: "📚",
      title: "Enroll to Access Lessons",
      message:
        "You need to enroll in this course before you can watch the lessons and track your progress.",
      actionText: "Go to Course Page",
      actionPath: `/CoursePage/${courseId}`,
      gradient: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
    },
    subscription: {
      icon: "⭐",
      title: "Subscription Required",
      message: "You need to subscribe to this course to access its lessons.",
      actionText: "View Course Details",
      actionPath: `/CoursePage/${courseId}`,
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    },
  };

  const config = configs[type];

  if (!config) return null;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Decorative circles */}
        <div className={styles.decorCircle1}></div>
        <div className={styles.decorCircle2}></div>

        <div className={styles.content}>
          <div
            className={styles.iconWrapper}
            style={{ background: config.gradient }}
          >
            <span className={styles.icon}>{config.icon}</span>
          </div>

          <h2 className={styles.title}>{config.title}</h2>
          <p className={styles.message}>{config.message}</p>

          {type === "login" ? (
            <Link to={config.actionPath} className={styles.actionBtn}>
              <span className={styles.btnIcon}>→</span>
              {config.actionText}
            </Link>
          ) : (
            <button
              className={styles.actionBtn}
              onClick={() => navigate(config.actionPath)}
              style={{ background: config.gradient }}
            >
              <span className={styles.btnIcon}>→</span>
              {config.actionText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

AccessDenied.propTypes = {
  type: PropTypes.oneOf(["login", "enrollment", "subscription"]).isRequired,
  courseId: PropTypes.string,
  blockReason: PropTypes.string,
  blockedAt: PropTypes.string,
};

export default AccessDenied;
