/**
 * InstructorInfo Component
 * Displays instructor avatar and name
 * Following Single Responsibility Principle
 */

import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import styles from "./InstructorInfo.module.css";

const InstructorInfo = ({ name, avatar, size, className }) => {
  const [imgError, setImgError] = useState(false);

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=3399cc&color=fff&size=${size * 2}`;

  const handleImageError = () => {
    setImgError(true);
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <img
        src={imgError ? fallbackAvatar : avatar || fallbackAvatar}
        alt={`${name}'s avatar`}
        className={styles.avatar}
        width={size}
        height={size}
        onError={handleImageError}
        loading="lazy"
      />
      <span className={styles.name}>{name}</span>
    </div>
  );
};

InstructorInfo.propTypes = {
  /** Instructor name */
  name: PropTypes.string.isRequired,
  /** Avatar URL */
  avatar: PropTypes.string,
  /** Avatar size in pixels */
  size: PropTypes.number,
  /** Additional CSS class */
  className: PropTypes.string,
};

InstructorInfo.defaultProps = {
  avatar: null,
  size: 32,
  className: "",
};

export default memo(InstructorInfo);
