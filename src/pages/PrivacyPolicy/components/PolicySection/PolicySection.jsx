/**
 * PolicySection Component
 * Reusable section component for displaying policy content blocks
 * Following Open/Closed Principle - extensible for different content types
 */

import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./PolicySection.module.css";

// Content renderer based on content type
const ContentRenderer = ({ content }) => {
  switch (content.type) {
    case "paragraph":
      return <p className={styles.paragraph}>{content.text}</p>;

    case "list":
      return (
        <div className={styles.listBlock}>
          {content.title && (
            <h4 className={styles.listTitle}>{content.title}</h4>
          )}
          <ul className={styles.list}>
            {content.items.map((item, index) => (
              <li key={index} className={styles.listItem}>
                <span className={styles.bullet}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "contact":
      return (
        <div className={styles.contactBlock}>
          <a
            href={`mailto:${content.details.email}?subject=${encodeURIComponent(content.details.subject)}`}
            className={styles.contactLink}
          >
            <span className={styles.contactIcon}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </span>
            <span className={styles.contactText}>
              <span className={styles.contactLabel}>Email Us</span>
              <span className={styles.contactEmail}>
                {content.details.email}
              </span>
            </span>
          </a>
        </div>
      );

    default:
      return null;
  }
};

ContentRenderer.propTypes = {
  content: PropTypes.shape({
    type: PropTypes.oneOf(["paragraph", "list", "contact"]).isRequired,
    text: PropTypes.string,
    title: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.string),
    details: PropTypes.shape({
      email: PropTypes.string,
      subject: PropTypes.string,
      address: PropTypes.string,
    }),
  }).isRequired,
};

const PolicySection = ({ id, icon, title, content, index = 0 }) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ""}`}
      style={{ "--section-delay": `${index * 100}ms` }}
      aria-labelledby={`${id}-title`}
    >
      <div className={styles.header}>
        <span className={styles.icon} role="presentation">
          {icon}
        </span>
        <h2 id={`${id}-title`} className={styles.title}>
          {title}
        </h2>
      </div>
      <div className={styles.content}>
        {content.map((block, blockIndex) => (
          <ContentRenderer key={blockIndex} content={block} />
        ))}
      </div>
    </section>
  );
};

PolicySection.propTypes = {
  id: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  index: PropTypes.number,
};

export default React.memo(PolicySection);
