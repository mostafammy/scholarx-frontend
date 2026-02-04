/**
 * HeroSection Component
 * Displays the Privacy Policy page hero with title, subtitle, and last updated date
 * Following Single Responsibility Principle - only handles hero presentation
 */

import React from "react";
import PropTypes from "prop-types";
import styles from "./HeroSection.module.css";

const HeroSection = ({ label, title, subtitle, lastUpdated, description }) => {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <span className={styles.label}>{label}</span>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        <p className={styles.description}>{description}</p>
        <div className={styles.meta}>
          <span className={styles.lastUpdated}>
            <svg
              className={styles.icon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Last Updated: {lastUpdated}
          </span>
        </div>
      </div>
      <div className={styles.decoration}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
        <div className={styles.circle3}></div>
      </div>
    </section>
  );
};

HeroSection.propTypes = {
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  lastUpdated: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default React.memo(HeroSection);
