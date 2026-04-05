/**
 * @fileoverview RegistrantsTable — Sortable, searchable data table for admin dashboard.
 * Pure UI — receives data + callbacks. No data fetching. No state.
 */

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { downloadCSV } from '../../utils/csvExport';
import Swal from 'sweetalert2';

/**
 * Formats an ISO timestamp to a readable local date/time string.
 * @param {string} iso
 * @returns {string}
 */
const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleString('en-EG', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

/** Column definition for the table header */
const COLUMNS = [
  { field: 'fullName',    label: 'Registrant',   sortable: true },
  { field: 'university',  label: 'Institution',   sortable: false },
  { field: 'governorate', label: 'Governorate',   sortable: true },
  { field: 'status',      label: 'Status',        sortable: false },
  { field: 'tracks',      label: 'Tracks',        sortable: false },
  { field: 'createdAt',   label: 'Registered At', sortable: true },
];

/**
 * @param {{
 *   registrations: import('../../services/RegistrationRepository').Registration[],
 *   filtered: import('../../services/RegistrationRepository').Registration[],
 *   sortField: string,
 *   sortDirection: 'asc' | 'desc',
 *   toggleSort: (field: string) => void,
 *   clearAllData: () => void,
 * }} props
 */
const RegistrantsTable = ({
  registrations,
  filtered,
  sortField,
  sortDirection,
  toggleSort,
  clearAllData,
}) => {
  const handleExport = useCallback(() => {
    downloadCSV(filtered, `summit2026-registrations-${Date.now()}.csv`);
  }, [filtered]);

  const handleClearAll = useCallback(async () => {
    const result = await Swal.fire({
      title: '⚠️ Clear All Data?',
      html: `
        <p style="color:#e2e8f0;">This will permanently delete all <strong style="color:#f5c518">${registrations.length}</strong> registrations.
        This action cannot be undone.</p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete All',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ff6b6b',
      cancelButtonColor: '#374151',
      background: '#0d1529',
      color: '#ffffff',
    });
    if (result.isConfirmed) clearAllData();
  }, [registrations.length, clearAllData]);

  return (
    <div>
      {/* Toolbar */}
      <div className="summit-db-table-toolbar">
        <p className="summit-db-table-count">
          Showing <strong>{filtered.length}</strong> of <strong>{registrations.length}</strong> registrations
        </p>
        <div className="summit-db-table-actions">
          <button
            type="button"
            id="db-export-btn"
            className="summit-db-btn-export"
            onClick={handleExport}
            disabled={filtered.length === 0}
            aria-label={`Export ${filtered.length} filtered registrations to CSV`}
          >
            ⬇ Export CSV
          </button>
          {registrations.length > 0 && (
            <button
              type="button"
              id="db-clear-btn"
              className="summit-db-btn-danger"
              onClick={handleClearAll}
              aria-label="Clear all registration data"
            >
              🗑 Clear All
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="summit-db-table-wrap">
        {filtered.length === 0 ? (
          <div className="summit-db-empty" role="status" aria-live="polite">
            <div className="summit-db-empty-icon" aria-hidden="true">
              {registrations.length === 0 ? '📭' : '🔍'}
            </div>
            <p className="summit-db-empty-title">
              {registrations.length === 0 ? 'No Registrations Yet' : 'No Results Found'}
            </p>
            <p className="summit-db-empty-desc">
              {registrations.length === 0
                ? 'Registrations will appear here as people sign up at the summit page.'
                : 'Try adjusting your filters or search query.'}
            </p>
          </div>
        ) : (
          <table className="summit-db-table" aria-label="Registrations data table">
            <thead>
              <tr>
                <th scope="col" style={{ width: 32 }}>#</th>
                {COLUMNS.map(({ field, label, sortable }) => (
                  <th
                    key={field}
                    scope="col"
                    className={[
                      sortable ? 'sortable' : '',
                      sortField === field ? 'sort-active' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={sortable ? () => toggleSort(field) : undefined}
                    aria-sort={
                      sortField === field
                        ? sortDirection === 'asc' ? 'ascending' : 'descending'
                        : sortable ? 'none' : undefined
                    }
                  >
                    {label}
                    {sortable && (
                      <span className="summit-db-sort-icon" aria-hidden="true">
                        {sortField === field
                          ? sortDirection === 'asc' ? ' ▲' : ' ▼'
                          : ' ↕'}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((reg, idx) => (
                <tr key={reg.id}>
                  <td className="summit-db-cell-date">{idx + 1}</td>
                  <td>
                    <div className="summit-db-cell-name">{reg.fullName}</div>
                    <div className="summit-db-cell-email">{reg.email}</div>
                    {reg.phone && (
                      <div className="summit-db-cell-email">{reg.phone}</div>
                    )}
                  </td>
                  <td>{reg.university || '—'}</td>
                  <td style={{ textTransform: 'capitalize' }}>
                    {reg.governorate?.replace(/-/g, ' ') || '—'}
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>
                    {reg.status?.replace(/-/g, ' ') || '—'}
                  </td>
                  <td>
                    {reg.tracks?.length > 0 ? (
                      <div className="summit-db-cell-tags">
                        {reg.tracks.map((t) => (
                          <span key={t} className="summit-db-tag summit-db-tag--track">
                            {t.replace(/-/g, ' ')}
                          </span>
                        ))}
                      </div>
                    ) : '—'}
                  </td>
                  <td className="summit-db-cell-date">{formatDate(reg.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

RegistrantsTable.propTypes = {
  registrations: PropTypes.array.isRequired,
  filtered: PropTypes.array.isRequired,
  sortField: PropTypes.string.isRequired,
  sortDirection: PropTypes.string.isRequired,
  toggleSort: PropTypes.func.isRequired,
  clearAllData: PropTypes.func.isRequired,
};

export default React.memo(RegistrantsTable);
