/**
 * @fileoverview StatsBar — Animated scroll-triggered counter row.
 * Composes useAnimatedCounter for each stat. Each StatCard is independent
 * and manages its own counter animation ref.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { SUMMIT_STATS } from '../../constants/eventData';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';

/**
 * Single animated stat card.
 * Isolated so each card has its own IntersectionObserver ref.
 * @type {React.NamedExoticComponent}
 */
const StatCard = React.memo(({ stat }) => {
  const { count, ref } = useAnimatedCounter(stat.value, 2200);

  return (
    <div
      ref={ref}
      className="summit-stat-card"
      role="figure"
      aria-label={`${stat.value}${stat.suffix} ${stat.label}`}
    >
      <span className="summit-stat-icon" aria-hidden="true">{stat.icon}</span>
      <div className="summit-stat-number" aria-live="polite">
        {count.toLocaleString()}{stat.suffix}
      </div>
      <div className="summit-stat-label">{stat.label}</div>
      <div className="summit-stat-desc">{stat.description}</div>
    </div>
  );
});

StatCard.displayName = 'StatCard';
StatCard.propTypes = {
  stat: PropTypes.shape({
    value: PropTypes.number.isRequired,
    suffix: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
  }).isRequired,
};

const StatsBar = () => (
  <section
    id="summit-stats"
    className="summit-stats"
    aria-labelledby="stats-heading"
  >
    <div className="summit-container">
      <div className="summit-section-header">
        <div className="summit-badge" aria-hidden="true">📊 Summit In Numbers</div>
        <h2 id="stats-heading" className="summit-sr-only">Summit Statistics</h2>
      </div>
      <div className="summit-stats-grid" role="list" aria-label="Summit statistics">
        {SUMMIT_STATS.map((stat) => (
          <div key={stat.label} role="listitem">
            <StatCard stat={stat} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default React.memo(StatsBar);
