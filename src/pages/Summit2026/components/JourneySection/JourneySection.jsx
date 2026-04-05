/**
 * @fileoverview JourneySection — Showcases the 10-governorate pre-summit tour.
 * Pure presentational component — all data sourced from constants (OCP compliant).
 */

import React from 'react';
import { motion } from 'framer-motion';
import { TOUR_GOVERNORATES } from '../../constants/eventData';

/** Framer Motion variants — defined outside component to prevent re-creation */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const textVariants = {
  hidden:  { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const boxVariants = {
  hidden:  { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const JourneySection = () => (
  <section id="summit-journey" className="summit-section summit-journey" aria-labelledby="journey-heading">
    <div className="summit-container">
      <div className="summit-section-header">
        <div className="summit-badge" aria-hidden="true">📍 10 Governorates Reached</div>
        <h2 id="journey-heading" className="summit-section-title">
          A Proven Track Record of Impact
        </h2>
      </div>

      {/* Intro split layout */}
      <div className="summit-journey-intro">
        <motion.div
          className="summit-journey-text"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={textVariants}
        >
          <p>
            The Next Scholar Summit is the culmination of an extensive journey across{' '}
            <strong style={{ color: 'var(--s-gold-400)' }}>10 Egyptian governorates</strong>.
            These tours, conducted in strategic partnership with EU Jeel Connect and Aspire
            Institute (founded at Harvard University), were dedicated to unlocking global
            opportunities and empowering youth in underserved areas.
          </p>
          <p style={{ marginTop: 20 }}>
            Having reached thousands of students on the ground, we are now bringing the
            impact to the heart of Cairo to host{' '}
            <strong style={{ color: 'var(--s-text-100)' }}>
              the largest gathering for global education and career excellence
            </strong>
            .
          </p>
        </motion.div>

        <motion.div
          className="summit-journey-highlight-box"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={boxVariants}
        >
          <div className="summit-journey-highlight-stat">10+</div>
          <p className="summit-journey-highlight-desc" style={{ marginTop: 8 }}>
            Governorates visited across Egypt — from Alexandria's coast to Aswan's south,
            thousands of students empowered before the main stage.
          </p>
          <div style={{ marginTop: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Aspire Institute', 'Harvard', 'EU Jeel Connect'].map((tag) => (
              <span key={tag} className="summit-db-tag" style={{ fontSize: '0.7rem' }}>{tag}</span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Governorate cards */}
      <motion.div
        className="summit-journey-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        role="list"
        aria-label="Governorates visited"
      >
        {TOUR_GOVERNORATES.map((gov, index) => (
          <motion.div
            key={gov.name}
            className="summit-journey-card"
            variants={cardVariants}
            role="listitem"
          >
            <span className="summit-journey-number" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="summit-journey-city">{gov.name}</h3>
            <p className="summit-journey-region">{gov.region}</p>
            <p className="summit-journey-students">{gov.students} students reached</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default React.memo(JourneySection);
