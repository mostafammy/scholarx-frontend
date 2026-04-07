/**
 * @fileoverview StatsCards — Dashboard KPI cards row.
 * Pure presentational: receives stats data via props (ISP compliant).
 */

import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * @param {{ stats: ReturnType<typeof import('../../services/RegistrationRepository').registrationRepository.getStats> }} props
 */
const StatsCards = ({ stats, isLoading }) => {
  const topGovernorate = Object.entries(stats.byGovernorate).sort(([, a], [, b]) => b - a)[0];
  const topTrack       = Object.entries(stats.byTrack).sort(([, a], [, b]) => b - a)[0];

  const Shimmer = () => (
    <div className="summit-db-skeleton" style={{ height: '32px', width: '100%', marginBottom: '4px' }} />
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 20, stiffness: 100 } }
  };

  return (
    <motion.div 
      className="summit-db-stats-row" 
      role="list" 
      aria-label="Dashboard statistics"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Total Registrations */}
      <motion.div variants={itemVariants} className="summit-db-stat-card summit-db-stat-card--total" role="listitem">
        <div className="summit-db-stat-icon summit-db-stat-icon--total" aria-hidden="true">📋</div>
        <div className="summit-db-stat-value" aria-label={`${stats.total} total registrations`}>
          {isLoading ? <Shimmer /> : stats.total.toLocaleString()}
        </div>
        <div className="summit-db-stat-label">Total Registrations</div>
        <div className="summit-db-stat-sub">All-time entries</div>
      </motion.div>

      {/* Today's Signups */}
      <motion.div variants={itemVariants} className="summit-db-stat-card summit-db-stat-card--today" role="listitem">
        <div className="summit-db-stat-icon summit-db-stat-icon--today" aria-hidden="true">📅</div>
        <div className="summit-db-stat-value" aria-label={`${stats.todayCount} registrations today`}>
          {isLoading ? <Shimmer /> : stats.todayCount}
        </div>
        <div className="summit-db-stat-label">Today's Signups</div>
        <div className="summit-db-stat-sub">{new Date().toLocaleDateString('en-EG', { month: 'short', day: 'numeric' })}</div>
      </motion.div>

      {/* Top Governorate */}
      <motion.div variants={itemVariants} className="summit-db-stat-card summit-db-stat-card--gov" role="listitem">
        <div className="summit-db-stat-icon summit-db-stat-icon--gov" aria-hidden="true">📍</div>
        <div className="summit-db-stat-value" aria-label={topGovernorate ? `${topGovernorate[1]} from top governorate` : '0'}>
          {isLoading ? <Shimmer /> : (topGovernorate ? topGovernorate[1] : '—')}
        </div>
        <div className="summit-db-stat-label">Top Governorate</div>
        <div className="summit-db-stat-sub">
          {topGovernorate ? topGovernorate[0].replace(/-/g, ' ') : 'No data yet'}
        </div>
      </motion.div>

      {/* Top Track */}
      <motion.div variants={itemVariants} className="summit-db-stat-card summit-db-stat-card--track" role="listitem">
        <div className="summit-db-stat-icon summit-db-stat-icon--track" aria-hidden="true">🎯</div>
        <div className="summit-db-stat-value" aria-label={topTrack ? `${topTrack[1]} for top track` : '0'}>
          {isLoading ? <Shimmer /> : (topTrack ? topTrack[1] : '—')}
        </div>
        <div className="summit-db-stat-label">Most Popular Track</div>
        <div className="summit-db-stat-sub">
          {topTrack ? topTrack[0].replace(/-/g, ' ') : 'No data yet'}
        </div>
      </motion.div>
    </motion.div>
  );
};

StatsCards.propTypes = {
  stats: PropTypes.shape({
    total: PropTypes.number.isRequired,
    todayCount: PropTypes.number.isRequired,
    byGovernorate: PropTypes.objectOf(PropTypes.number).isRequired,
    byTrack: PropTypes.objectOf(PropTypes.number).isRequired,
  }).isRequired,
  isLoading: PropTypes.bool,
};

export default React.memo(StatsCards);
