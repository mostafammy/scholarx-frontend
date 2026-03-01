import React, { memo } from "react";
import PropTypes from "prop-types";
import styles from "./SalesInquiryCTA.module.css";

const STATUS_LABELS = {
  new: "Inquiry Received",
  contacted: "Being Contacted",
  converted: "Enrolled",
  lost: "Closed",
};

/** Status-aware body copy for the confirmation banner (spec §3.2) */
const STATUS_MESSAGES = {
  new: "Your inquiry is received. We\u2019ll contact you soon.",
  contacted: "Our team has been in touch! We\u2019ll finalise details shortly.",
  converted: "You\u2019re enrolled! Go to My Courses to start learning.",
  lost: "Your inquiry was closed. Contact support if you need help.",
};

/** Status-aware banner title — avoids "Inquiry Submitted" for terminal states */
const STATUS_TITLES = {
  new: "Inquiry Submitted",
  contacted: "Inquiry Submitted",
  converted: "You\u2019re Enrolled!",
  lost: "Inquiry Closed",
};

/** Status-aware icon — \u2705 is misleading for lost/closed */
const STATUS_ICONS = {
  new: "\u2705",
  contacted: "\u{1F4AC}",
  converted: "\u{1F393}",
  lost: "\u{1F4CB}",
};

const STATUS_CLASS = {
  new: styles.statusNew,
  contacted: styles.statusContacted,
  converted: styles.statusConverted,
  lost: styles.statusLost,
};

/**
 * SalesInquiryCTA
 *
 * Rendered on the CourseHero and StickyEnrollBar for paid courses when
 * the user does not have access yet.
 *
 * Two states:
 *  - hasInquiry === false → "Contact Sales" button → opens inquiry modal
 *  - hasInquiry === true  → confirmation banner with status badge
 *
 * @param {{
 *   hasInquiry: boolean,
 *   inquiry: object | null,
 *   onOpen: function,
 *   isLoading: boolean,
 *   compact: boolean,   // true inside StickyEnrollBar
 *   onLight: boolean,   // true when rendered on light background
 * }} props
 */
const SalesInquiryCTA = ({
  hasInquiry,
  inquiry,
  onOpen,
  isLoading,
  compact,
  onLight,
}) => {
  if (hasInquiry && inquiry) {
    const status = inquiry.status || "new";
    return (
      <div
        className={[styles.banner, onLight ? styles.onLight : ""]
          .filter(Boolean)
          .join(" ")}
        role="status"
        aria-live="polite"
      >
        <span className={styles.bannerIcon} aria-hidden="true">
          {STATUS_ICONS[status] || "✅"}
        </span>
        <div className={styles.bannerBody}>
          <span className={styles.bannerTitle}>
            {STATUS_TITLES[status] || "Inquiry Submitted"}
          </span>
          <p className={styles.bannerText}>
            {STATUS_MESSAGES[status] ||
              "Our sales team will contact you on the WhatsApp number you provided."}
          </p>
          <div className={styles.bannerFooter}>
            <span
              className={[
                styles.statusDot,
                STATUS_CLASS[status] || styles.statusNew,
              ].join(" ")}
            >
              {STATUS_LABELS[status] || status}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={[
        styles.contactBtn,
        compact ? styles.compact : "",
        isLoading ? styles.loading : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onOpen}
      disabled={isLoading}
      aria-label="Contact Sales team for this course"
    >
      <span className={styles.btnIcon} aria-hidden="true">
        💬
      </span>
      I’m Interested
    </button>
  );
};

SalesInquiryCTA.propTypes = {
  hasInquiry: PropTypes.bool,
  inquiry: PropTypes.object,
  onOpen: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  compact: PropTypes.bool,
  onLight: PropTypes.bool,
};

SalesInquiryCTA.defaultProps = {
  hasInquiry: false,
  inquiry: null,
  isLoading: false,
  compact: false,
  onLight: false,
};

export default memo(SalesInquiryCTA);
