/**
 * InstructorSpotlight Component
 * Premium instructor showcase with avatar, bio, and achievements
 *
 * Architecture:
 * - Single Responsibility: Instructor display only
 * - Graceful fallback for missing data
 * - Expandable bio with "Read more" functionality
 */

import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import styles from "./InstructorSpotlight.module.css";

/**
 * Achievement badge component
 */
const AchievementBadge = ({ text, index }) => (
  <li
    className={styles.achievement}
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <span className={styles.achievementIcon}>✓</span>
    <span className={styles.achievementText}>{text}</span>
  </li>
);

/**
 * Social link button
 */
const SocialLink = ({ platform, url }) => {
  const icons = {
    linkedin: "💼",
    twitter: "🐦",
    youtube: "▶️",
    github: "💻",
    website: "🌐",
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.socialLink}
      aria-label={`Visit instructor's ${platform}`}
    >
      <span>{icons[platform] || "🔗"}</span>
    </a>
  );
};

/**
 * InstructorSpotlight - Main component
 */
const InstructorSpotlight = ({ instructor }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!instructor || !instructor.name) {
    return null; // Graceful fallback
  }

  const {
    name,
    title,
    bio,
    image,
    achievements = [],
    socialLinks = {},
    studentsCount,
    coursesCount,
    rating,
  } = instructor;

  const truncatedBio = bio?.length > 200 ? `${bio.slice(0, 200)}...` : bio;
  const displayBio = isExpanded ? bio : truncatedBio;
  const hasSocialLinks = Object.keys(socialLinks).length > 0;

  return (
    <section className={styles.spotlight}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Meet Your Instructor</h2>
        </div>

        {/* Instructor Card */}
        <div className={styles.card}>
          {/* Avatar Section */}
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              <img
                src={image || "/default-avatar.png"}
                alt={name}
                className={styles.avatar}
                loading="lazy"
              />
              <div className={styles.verifiedBadge} title="Verified Instructor">
                ✓
              </div>
            </div>

            {/* Quick Stats */}
            <div className={styles.quickStats}>
              {studentsCount && (
                <div className={styles.quickStat}>
                  <span className={styles.quickStatValue}>
                    {studentsCount.toLocaleString()}
                  </span>
                  <span className={styles.quickStatLabel}>Students</span>
                </div>
              )}
              {coursesCount && (
                <div className={styles.quickStat}>
                  <span className={styles.quickStatValue}>{coursesCount}</span>
                  <span className={styles.quickStatLabel}>Courses</span>
                </div>
              )}
              {rating && (
                <div className={styles.quickStat}>
                  <span className={styles.quickStatValue}>⭐ {rating}</span>
                  <span className={styles.quickStatLabel}>Rating</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            {hasSocialLinks && (
              <div className={styles.socialLinks}>
                {Object.entries(socialLinks).map(([platform, url]) => (
                  <SocialLink key={platform} platform={platform} url={url} />
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className={styles.infoSection}>
            <div className={styles.nameTitle}>
              <h3 className={styles.name}>{name}</h3>
              {title && <p className={styles.title}>{title}</p>}
            </div>

            {/* Bio */}
            {bio && (
              <div className={styles.bioWrapper}>
                <p className={styles.bio}>{displayBio}</p>
                {bio.length > 200 && (
                  <button
                    className={styles.readMoreBtn}
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? "Show Less" : "Read More"}
                  </button>
                )}
              </div>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
              <div className={styles.achievementsSection}>
                <h4 className={styles.achievementsTitle}>Key Achievements</h4>
                <ul className={styles.achievementsList}>
                  {achievements.slice(0, 4).map((achievement, index) => (
                    <AchievementBadge
                      key={index}
                      text={achievement}
                      index={index}
                    />
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

InstructorSpotlight.propTypes = {
  instructor: PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string,
    bio: PropTypes.string,
    image: PropTypes.string,
    achievements: PropTypes.arrayOf(PropTypes.string),
    socialLinks: PropTypes.object,
    studentsCount: PropTypes.number,
    coursesCount: PropTypes.number,
    rating: PropTypes.number,
  }),
};

InstructorSpotlight.defaultProps = {
  instructor: null,
};

export default memo(InstructorSpotlight);
