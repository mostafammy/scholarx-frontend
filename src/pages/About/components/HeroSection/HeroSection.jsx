/**
 * HeroSection Component
 * Displays the About page hero with title and image gallery
 */

import React from "react";
import PropTypes from "prop-types";
import styles from "./HeroSection.module.css";

const HeroSection = ({ label, title, gallery }) => {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <p className={styles.label}>{label}</p>
        <h1 className={styles.title}>{title}</h1>
      </div>

      <div className={styles.gallery}>
        {gallery.map((image, index) => (
          <div
            key={image.id}
            className={styles.imageWrapper}
            style={{ "--animation-delay": `${index * 150}ms` }}
          >
            <img
              src={image.src}
              alt={image.alt}
              className={styles.image}
              loading={index === 0 ? "eager" : "lazy"}
            />
            <div className={styles.overlay}></div>
          </div>
        ))}
      </div>
    </section>
  );
};

HeroSection.propTypes = {
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  gallery: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      src: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default React.memo(HeroSection);
