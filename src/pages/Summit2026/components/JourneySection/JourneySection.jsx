/**
 * @fileoverview JourneySection — Showcases the 10-governorate pre-summit tour.
 * Pure presentational component — all data sourced from constants (OCP compliant).
 */

import React from "react";
import { motion } from "framer-motion";

const textVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const JourneySection = () => (
  <section
    id="summit-journey"
    className="summit-section summit-journey"
    aria-labelledby="journey-heading"
  >
    <div className="summit-container">
      <div className="summit-section-header">
        <div className="summit-badge" aria-hidden="true">
          🎯
        </div>
        <h2 id="journey-heading" className="summit-section-title">
          Looking for a Real Global Opportunity?
        </h2>
      </div>

      <motion.div
        className="summit-journey-text"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={textVariants}
      >
        <p>
          Looking for a real opportunity to study abroad or build an
          international career path?
        </p>
        <p style={{ marginTop: 20 }}>
          After a successful tour across{" "}
          <strong style={{ color: "var(--s-gold-400)" }}>
            10 Egyptian governorates
          </strong>{" "}
          and life-changing impact for thousands of students, ScholarX and the
          European Union initiative EU Jeel Connect are bringing the biggest
          event to the heart of Cairo.
        </p>
        <p style={{ marginTop: 20 }}>
          This is not just another summit. It is your launchpad toward fully
          funded opportunities and the exact skills demanded by the global job
          market.
        </p>
      </motion.div>
    </div>
  </section>
);

export default React.memo(JourneySection);
