/**
 * @fileoverview CSV export utility for summit registrations.
 * Single Responsibility: ONLY handles CSV serialization and download.
 */

/**
 * @typedef {import('../services/RegistrationRepository').Registration} Registration
 */

/** Column definitions — single source of truth for CSV headers and field mapping */
const CSV_COLUMNS = Object.freeze([
  { header: 'ID', field: 'id' },
  { header: 'Registered At', field: 'createdAt' },
  { header: 'Full Name', field: 'fullName' },
  { header: 'Email', field: 'email' },
  { header: 'Phone', field: 'phone' },
  { header: 'University / Institution', field: 'university' },
  { header: 'Graduation Year', field: 'graduationYear' },
  { header: 'Status', field: 'status' },
  { header: 'Field of Study', field: 'fieldOfStudy' },
  { header: 'Governorate', field: 'governorate' },
  { header: 'Referral Sources', field: 'referralSources' },
  { header: 'Tracks of Interest', field: 'tracks' },
  { header: 'Workshops', field: 'workshops' },
  { header: 'Special Accommodations', field: 'specialAccommodations' },
]);

/**
 * Escapes a CSV cell value, quoting if it contains commas, newlines, or quotes.
 * @param {unknown} value
 * @returns {string}
 */
const escapeCell = (value) => {
  if (value === null || value === undefined) return '';
  const str = Array.isArray(value) ? value.join('; ') : String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

/**
 * Converts a registration array to a RFC 4180-compliant CSV string.
 * @param {Registration[]} registrations
 * @returns {string}
 */
export const toCSVString = (registrations) => {
  const headers = CSV_COLUMNS.map((col) => escapeCell(col.header)).join(',');
  const rows = registrations.map((reg) =>
    CSV_COLUMNS.map((col) => escapeCell(reg[col.field])).join(',')
  );
  return [headers, ...rows].join('\r\n');
};

/**
 * Triggers a browser download of registrations as a CSV file.
 * @param {Registration[]} registrations
 * @param {string} [filename]
 * @returns {void}
 */
export const downloadCSV = (registrations, filename = 'summit2026-registrations.csv') => {
  const csv = toCSVString(registrations);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};
