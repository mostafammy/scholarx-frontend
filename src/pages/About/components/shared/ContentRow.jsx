/**
 * ContentRow Component
 * Reusable component for displaying content in a two-column layout
 * Supports text + image in any order with animations
 */

import React from "react";
import PropTypes from "prop-types";
import styles from "./ContentRow.module.css";

const ContentRow = ({
  label,
  title,
  content,
  image,
  reversed = false,
  delay = 0,
}) => {
  const rowClass = reversed ? `${styles.row} ${styles.reversed}` : styles.row;

  return (
    <section className={rowClass} style={{ "--animation-delay": `${delay}ms` }}>
      <div className={styles.textBlock}>
        {label && <p className={styles.label}>{label}</p>}
        {title && <h2 className={styles.title}>{title}</h2>}
        <div className={styles.content}>
          {Array.isArray(content) ? (
            content.map((paragraph, index) => (
              <p key={index} className={styles.paragraph}>
                {paragraph}
              </p>
            ))
          ) : (
            <p className={styles.paragraph}>{content}</p>
          )}
        </div>
      </div>

      <div className={styles.imageBlock}>
        <div className={styles.imageWrapper}>
          <img
            src={image.src}
            alt={image.alt}
            className={styles.image}
            loading="lazy"
          />
          {image.caption && (
            <p className={styles.imageCaption}>{image.caption}</p>
          )}
        </div>
      </div>
    </section>
  );
};

ContentRow.propTypes = {
  label: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    caption: PropTypes.string,
  }).isRequired,
  reversed: PropTypes.bool,
  delay: PropTypes.number,
};

export default React.memo(ContentRow);
