/**
 * CourseOverview Component
 * Glassmorphism stat cards with animated counters and course highlights
 *
 * Architecture:
 * - Single Responsibility: Overview section with stats and highlights
 * - Animated counters using IntersectionObserver
 * - Responsive grid layout
 */

import React, { memo, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./CourseOverview.module.css";

/**
 * AnimatedCounter - Counts up from 0 to target value
 */
const AnimatedCounter = ({ value, duration = 1500, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateValue(0, value, duration);
        }
      },
      { threshold: 0.5 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  const animateValue = (start, end, dur) => {
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / dur, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(easeOutQuart * (end - start) + start);

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <span ref={ref} className={styles.counterValue}>
      {count}
      {suffix}
    </span>
  );
};

/**
 * StatCard - Individual glassmorphism stat card
 */
const StatCard = ({ icon, count, label, delay = 0 }) => (
  <div className={styles.statCard} style={{ animationDelay: `${delay}ms` }}>
    <div className={styles.statIcon}>{icon}</div>
    <div className={styles.statContent}>
      <AnimatedCounter value={count} />
      <span className={styles.statLabel}>{label}</span>
    </div>
  </div>
);

/**
 * HighlightBadge - Course highlight badge
 */
const HighlightBadge = ({ icon, text, delay = 0 }) => (
  <div
    className={styles.highlightBadge}
    style={{ animationDelay: `${delay}ms` }}
  >
    <span className={styles.highlightIcon}>{icon}</span>
    <span className={styles.highlightText}>{text}</span>
  </div>
);

/**
 * CourseOverview - Main overview section
 */
const CourseOverview = ({
  videosCount,
  quizzesCount,
  pdfCount,
  duration,
  skillLevel,
  hasCertificate,
  highlights,
}) => {
  const stats = [
    { icon: "🎬", count: videosCount, label: "Video Lessons" },
    { icon: "📝", count: quizzesCount, label: "Quizzes" },
    { icon: "📄", count: pdfCount, label: "Resources" },
  ].filter((stat) => stat.count > 0);

  const defaultHighlights = [
    duration && { icon: "⏱️", text: duration },
    skillLevel && { icon: "📊", text: skillLevel },
    hasCertificate && { icon: "🎓", text: "Certificate Included" },
  ].filter(Boolean);

  const allHighlights = [...defaultHighlights, ...(highlights || [])];

  return (
    <section className={styles.overview}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Course Overview</h2>
          <p className={styles.sectionSubtitle}>
            Everything you need to succeed in your learning journey
          </p>
        </div>

        {/* Stats Grid */}
        {stats.length > 0 && (
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <StatCard
                key={stat.label}
                icon={stat.icon}
                count={stat.count}
                label={stat.label}
                delay={index * 100}
              />
            ))}
          </div>
        )}

        {/* Highlights */}
        {allHighlights.length > 0 && (
          <div className={styles.highlightsWrapper}>
            <div className={styles.highlights}>
              {allHighlights.map((highlight, index) => (
                <HighlightBadge
                  key={highlight.text}
                  icon={highlight.icon}
                  text={highlight.text}
                  delay={index * 80}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

CourseOverview.propTypes = {
  videosCount: PropTypes.number,
  quizzesCount: PropTypes.number,
  pdfCount: PropTypes.number,
  duration: PropTypes.string,
  skillLevel: PropTypes.string,
  hasCertificate: PropTypes.bool,
  highlights: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }),
  ),
};

CourseOverview.defaultProps = {
  videosCount: 0,
  quizzesCount: 0,
  pdfCount: 0,
  duration: "",
  skillLevel: "",
  hasCertificate: false,
  highlights: [],
};

export default memo(CourseOverview);
