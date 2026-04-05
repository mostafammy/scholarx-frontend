/**
 * @fileoverview RoundtableSection — Pre-summit high-level roundtable showcase.
 * Split layout: storytelling text left, glassmorphic highlights card right.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ROUNDTABLE_DATA } from '../../constants/eventData';

const slideLeft = {
  hidden:  { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const slideRight = {
  hidden:  { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 } },
};

const RoundtableSection = () => (
  <section
    id="summit-roundtable"
    className="summit-section summit-roundtable"
    aria-labelledby="roundtable-heading"
  >
    <div className="summit-container">
      <div className="summit-roundtable-inner">

        {/* Left: Text */}
        <motion.div
          className="summit-roundtable-text"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideLeft}
        >
          <div className="summit-badge" aria-hidden="true">🏛️ Pre-Summit Exclusive</div>
          <h2 id="roundtable-heading" className="summit-roundtable-title">
            {ROUNDTABLE_DATA.title}
          </h2>
          <p className="summit-roundtable-subtitle">
            "{ROUNDTABLE_DATA.subtitle}"
          </p>
          <p className="summit-roundtable-desc">{ROUNDTABLE_DATA.description}</p>
        </motion.div>

        {/* Right: Glassmorphic card */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideRight}
        >
          <div className="summit-roundtable-card" role="region" aria-label="Roundtable highlights">
            <p className="summit-roundtable-highlights-title">Key Participants</p>
            <ul className="summit-roundtable-highlights-list">
              {ROUNDTABLE_DATA.highlights.map(({ icon, text }) => (
                <li key={text} className="summit-roundtable-highlight-item">
                  <span className="summit-roundtable-highlight-icon" aria-hidden="true">{icon}</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            <div className="summit-roundtable-key-highlight" role="note">
              <strong>🔑 Key Announcement:</strong>{' '}
              {ROUNDTABLE_DATA.keyHighlight}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  </section>
);

export default React.memo(RoundtableSection);
