/**
 * @fileoverview FilterBar — Admin dashboard filter controls.
 * Controlled component: all filter state lives in parent (useSummitDashboard hook).
 */

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { SUMMIT_TRACKS } from '../../constants/eventData';
import { EGYPTIAN_GOVERNORATES } from '../../constants/governorates';

/**
 * @param {{
 *   filters: import('../../hooks/useSummitDashboard').DashboardFilters,
 *   setFilter: (key: string, value: string) => void,
 *   resetFilters: () => void,
 * }} props
 */
const FilterBar = ({ filters, setFilter, resetFilters }) => {
  const handleChange = useCallback(
    (key) => (e) => setFilter(key, e.target.value),
    [setFilter]
  );

  return (
    <div className="summit-db-filter-bar" role="search" aria-label="Filter registrations">
      {/* Text Search */}
      <div className="summit-db-filter-group summit-db-filter-group--search">
        <label htmlFor="db-search" className="summit-db-filter-label">Search</label>
        <input
          id="db-search"
          type="search"
          className="summit-db-filter-input"
          placeholder="Search by name, email, or university..."
          value={filters.search}
          onChange={handleChange('search')}
          aria-label="Search registrations"
        />
      </div>

      {/* Governorate */}
      <div className="summit-db-filter-group">
        <label htmlFor="db-gov" className="summit-db-filter-label">Governorate</label>
        <select
          id="db-gov"
          className="summit-db-filter-select"
          value={filters.governorate}
          onChange={handleChange('governorate')}
          aria-label="Filter by governorate"
        >
          <option value="">All Governorates</option>
          {EGYPTIAN_GOVERNORATES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Track */}
      <div className="summit-db-filter-group">
        <label htmlFor="db-track" className="summit-db-filter-label">Track</label>
        <select
          id="db-track"
          className="summit-db-filter-select"
          value={filters.track}
          onChange={handleChange('track')}
          aria-label="Filter by track"
        >
          <option value="">All Tracks</option>
          {SUMMIT_TRACKS.map(({ id, title }) => (
            <option key={id} value={id}>{title}</option>
          ))}
        </select>
      </div>

      {/* Date Range */}
      <div className="summit-db-filter-group">
        <label htmlFor="db-date-from" className="summit-db-filter-label">From Date</label>
        <input
          id="db-date-from"
          type="date"
          className="summit-db-filter-input"
          value={filters.dateFrom}
          onChange={handleChange('dateFrom')}
          aria-label="Filter from date"
          style={{ colorScheme: 'dark' }}
        />
      </div>

      <div className="summit-db-filter-group">
        <label htmlFor="db-date-to" className="summit-db-filter-label">To Date</label>
        <input
          id="db-date-to"
          type="date"
          className="summit-db-filter-input"
          value={filters.dateTo}
          onChange={handleChange('dateTo')}
          aria-label="Filter to date"
          style={{ colorScheme: 'dark' }}
        />
      </div>

      {/* Reset */}
      <div className="summit-db-filter-actions">
        <button
          type="button"
          id="db-reset-filters-btn"
          className="summit-db-btn-reset"
          onClick={resetFilters}
          aria-label="Reset all filters"
        >
          ↺ Reset
        </button>
      </div>
    </div>
  );
};

FilterBar.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string.isRequired,
    governorate: PropTypes.string.isRequired,
    track: PropTypes.string.isRequired,
    dateFrom: PropTypes.string.isRequired,
    dateTo: PropTypes.string.isRequired,
  }).isRequired,
  setFilter: PropTypes.func.isRequired,
  resetFilters: PropTypes.func.isRequired,
};

export default React.memo(FilterBar);
