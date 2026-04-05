/**
 * @fileoverview TracksSection — 4 strategic track cards with gradient glassmorphism.
 * Data-driven: adding a new track requires only eventData.js update (OCP).
 */

import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { SUMMIT_TRACKS } from '../../constants/eventData';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 32, scale: 0.96 },
  visible: { opacity: 1, y: 0,  scale: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * Single track card — memoized for performance.
 * @type {React.NamedExoticComponent}
 */
const TrackCard = React.memo(({ track }) => (
  <motion.article
    className="summit-track-card"
    style={{ background: track.gradient, borderColor: track.borderColor }}
    variants={cardVariants}
    aria-label={track.title}
  >
    <div className="summit-track-icon-wrap" aria-hidden="true">
      {track.icon}
    </div>
    <h3 className="summit-track-title" style={{ color: track.color }}>
      {track.title}
    </h3>
    <p className="summit-track-desc">{track.description}</p>
  </motion.article>
));

TrackCard.displayName = 'TrackCard';
TrackCard.propTypes = {
  track: PropTypes.shape({
    id: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    gradient: PropTypes.string.isRequired,
    borderColor: PropTypes.string.isRequired,
  }).isRequired,
};

const TracksSection = () => (
  <section
    id="summit-tracks"
    className="summit-section summit-tracks"
    aria-labelledby="tracks-heading"
  >
    <div className="summit-container">
      <div className="summit-section-header">
        <div className="summit-badge" aria-hidden="true">✅ What You Will Gain</div>
        <h2 id="tracks-heading" className="summit-section-title">
          4 Strategic Tracks Designed for Your Future
        </h2>
        <p className="summit-section-subtitle">
          Explore practical sessions that move you from ambition to global readiness.
        </p>
      </div>

      <motion.div
        className="summit-tracks-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        role="list"
        aria-label="Summit strategic tracks"
      >
        {SUMMIT_TRACKS.map((track) => (
          <div key={track.id} role="listitem">
            <TrackCard track={track} />
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default React.memo(TracksSection);
