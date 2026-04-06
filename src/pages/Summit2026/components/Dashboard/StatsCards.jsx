/**
 * @fileoverview StatsCards — Dashboard KPI cards row.
 * Pure presentational: receives stats data via props (ISP compliant).
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * @param {{ stats: ReturnType<typeof import('../../services/RegistrationRepository').registrationRepository.getStats> }} props
 */
const StatsCards = ({ stats, isLoading }) => {
  const topGovernorate = Object.entries(stats.byGovernorate).sort(([, a], [, b]) => b - a)[0];
  const topTrack       = Object.entries(stats.byTrack).sort(([, a], [, b]) => b - a)[0];

  const Shimmer = () => (
    <div className="summit-db-skeleton" style={{ height: '32px', width: '100%', marginBottom: '4px' }} />
  );

  return (
    <div className="summit-db-stats-row" role="list" aria-label="Dashboard statistics">
      {/* Total Registrations */}
      <div className="summit-db-stat-card summit-db-stat-card--total" role="listitem">
        <div className="summit-db-stat-icon summit-db-stat-icon--total" aria-hidden="true">📋</div>
        <div className="summit-db-stat-value" aria-label={`${stats.total} total registrations`}>
          {isLoading ? <Shimmer /> : stats.total.toLocaleString()}
        </div>
        <div className="summit-db-stat-label">Total Registrations</div>
        <div className="summit-db-stat-sub">All-time entries</div>
      </div>

      {/* Today's Signups */}
      <div className="summit-db-stat-card summit-db-stat-card--today" role="listitem">
        <div className="summit-db-stat-icon summit-db-stat-icon--today" aria-hidden="true">📅</div>
        <div className="summit-db-stat-value" aria-label={`${stats.todayCount} registrations today`}>
          {isLoading ? <Shimmer /> : stats.todayCount}
        </div>
        <div className="summit-db-stat-label">Today's Signups</div>
        <div className="summit-db-stat-sub">{new Date().toLocaleDateString('en-EG', { month: 'short', day: 'numeric' })}</div>
      </div>

      {/* Top Governorate */}
      <div className="summit-db-stat-card summit-db-stat-card--gov" role="listitem">
        <div className="summit-db-stat-icon summit-db-stat-icon--gov" aria-hidden="true">📍</div>
        <div className="summit-db-stat-value" aria-label={topGovernorate ? `${topGovernorate[1]} from top governorate` : '0'}>
          {isLoading ? <Shimmer /> : (topGovernorate ? topGovernorate[1] : '—')}
        </div>
        <div className="summit-db-stat-label">Top Governorate</div>
        <div className="summit-db-stat-sub">
          {topGovernorate ? topGovernorate[0].replace(/-/g, ' ') : 'No data yet'}
        </div>
      </div>

      {/* Top Track */}
      <div className="summit-db-stat-card summit-db-stat-card--track" role="listitem">
        <div className="summit-db-stat-icon summit-db-stat-icon--track" aria-hidden="true">🎯</div>
        <div className="summit-db-stat-value" aria-label={topTrack ? `${topTrack[1]} for top track` : '0'}>
          {isLoading ? <Shimmer /> : (topTrack ? topTrack[1] : '—')}
        </div>
        <div className="summit-db-stat-label">Most Popular Track</div>
        <div className="summit-db-stat-sub">
          {topTrack ? topTrack[0].replace(/-/g, ' ') : 'No data yet'}
        </div>
      </div>
    </div>
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
