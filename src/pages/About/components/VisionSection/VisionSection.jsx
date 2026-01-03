/**
 * VisionSection Component
 * Displays the organization's vision statement with decorative image
 */

import React from "react";
import PropTypes from "prop-types";
import styles from "./VisionSection.module.css";

const VisionSection = ({ image, text }) => {
  return (
    <section className={styles.section}>
      <div className={styles.wrapper}>
        <div className={styles.imageBlock}>
          <img
            src={image.src}
            alt={image.alt}
            className={styles.image}
            loading="lazy"
          />
        </div>
        <p className={styles.text}>{text}</p>
      </div>
      <div className={styles.underline}></div>
    </section>
  );
};

VisionSection.propTypes = {
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
  }).isRequired,
  text: PropTypes.string.isRequired,
};

export default React.memo(VisionSection);
