/**
 * CompletionCelebration Component
 * Course completion celebration with certificate actions
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import styles from "./CompletionCelebration.module.css";

const CompletionCelebration = memo(function CompletionCelebration({
  onViewCertificate,
  hasCertificate,
}) {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* Confetti Animation */}
      <div className={styles.confetti}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={styles.confettiPiece}
            style={{
              "--delay": `${i * 0.1}s`,
              "--position": `${i * 8 + 4}%`,
              "--color": [
                "#667eea",
                "#764ba2",
                "#48bb78",
                "#f59e0b",
                "#ef4444",
              ][i % 5],
            }}
          />
        ))}
      </div>

      <div className={styles.content}>
        <div className={styles.icon}>🎉</div>
        <h3 className={styles.title}>Congratulations!</h3>
        <p className={styles.message}>
          You have successfully completed all lessons in this course!
        </p>

        <div className={styles.actions}>
          <button
            className={styles.primaryBtn}
            onClick={() => navigate("/certificates")}
          >
            <span className={styles.btnIcon}>🏆</span>
            View Certificate
          </button>

          {hasCertificate && (
            <button className={styles.secondaryBtn} onClick={onViewCertificate}>
              <span className={styles.btnIcon}>📜</span>
              Preview Certificate
            </button>
          )}
        </div>
      </div>

      {/* Stars decoration */}
      <div className={styles.stars}>
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={styles.star}
            style={{
              "--delay": `${i * 0.2}s`,
              "--position": `${i * 20 + 10}%`,
            }}
          >
            ⭐
          </span>
        ))}
      </div>
    </div>
  );
});

CompletionCelebration.propTypes = {
  onViewCertificate: PropTypes.func,
  hasCertificate: PropTypes.bool,
};

export default CompletionCelebration;
