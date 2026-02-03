/**
 * FAQAccordion Component
 * Expandable Q&A section with smooth animations
 *
 * Architecture:
 * - Single Responsibility: FAQ display only
 * - Graceful fallback when no FAQ data
 * - Keyboard accessible
 */

import React, { memo, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./FAQAccordion.module.css";

/**
 * FAQItem - Individual FAQ accordion item
 */
const FAQItem = ({ question, answer, isOpen, onToggle, index }) => {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div
      className={`${styles.faqItem} ${isOpen ? styles.open : ""}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <button
        className={styles.faqQuestion}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
      >
        <span className={styles.questionText}>{question}</span>
        <span className={styles.toggleIcon}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line
              x1="12"
              y1="5"
              x2="12"
              y2="19"
              className={styles.verticalLine}
            />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>

      <div
        id={`faq-answer-${index}`}
        className={styles.faqAnswer}
        style={{ height: `${height}px` }}
        aria-hidden={!isOpen}
      >
        <div ref={contentRef} className={styles.answerContent}>
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
};

/**
 * FAQAccordion - Main component
 */
const FAQAccordion = ({ faqs = [], defaultOpen = 0 }) => {
  const [openIndex, setOpenIndex] = useState(defaultOpen);

  // Graceful fallback when no FAQ data
  if (!faqs || faqs.length === 0) {
    return null;
  }

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className={styles.faqSection}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <p className={styles.sectionSubtitle}>
            Got questions? We've got answers.
          </p>
        </div>

        {/* FAQ List */}
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.id || index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

FAQAccordion.propTypes = {
  faqs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      question: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired,
    }),
  ),
  defaultOpen: PropTypes.number,
};

FAQAccordion.defaultProps = {
  faqs: [],
  defaultOpen: 0,
};

export default memo(FAQAccordion);
