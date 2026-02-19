/**
 * Shared date formatting utilities.
 *
 * Centralizes the `formatDate` helper that was previously duplicated
 * across Certificate.jsx, CertificateModal.jsx, Certificates.jsx,
 * CertificateVerify.jsx, and ReviewsSection.jsx.
 */

/**
 * Format a date string or Date object into a human-readable format.
 *
 * @param {string | Date} date - The date to format
 * @param {Intl.DateTimeFormatOptions} [options] - Optional Intl options override
 * @returns {string} Formatted date string (e.g., "January 15, 2025")
 */
export const formatDate = (date, options) => {
  if (!date) return "Date not available";
  try {
    return new Date(date).toLocaleDateString(
      "en-US",
      options || {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  } catch {
    return "Invalid date";
  }
};
