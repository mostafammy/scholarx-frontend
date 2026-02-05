/**
 * Error Utilities Module
 *
 * Centralized error message extraction following Single Responsibility Principle.
 * Handles various error formats from Axios, JSend responses, and standard Error objects.
 *
 * @module errorUtils
 */

/**
 * Extracts a user-friendly error message from various error formats.
 * Handles: Axios errors, JSend responses, standard Error objects.
 *
 * @param {unknown} error - The error to extract message from
 * @param {string} [fallback='An unexpected error occurred.'] - Fallback message if extraction fails
 * @returns {string} A user-friendly error message
 *
 * @example
 * // Axios JSend error
 * extractErrorMessage({ response: { data: { message: 'User exists' } } })
 * // Returns: 'User exists'
 *
 * @example
 * // Network error
 * extractErrorMessage({ message: 'Network Error' })
 * // Returns: 'Network Error'
 */
export const extractErrorMessage = (
  error,
  fallback = "An unexpected error occurred.",
) => {
  // Already a string
  if (typeof error === "string") return error;

  // Axios error with response data
  if (error?.response?.data) {
    const data = error.response.data;
    // JSend error: { status: 'error', message: '...' }
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }
    // JSend fail with string data: { status: 'fail', data: 'Invalid email' }
    if (typeof data.data === "string" && data.data.trim()) {
      return data.data;
    }
    // Nested message: { data: { message: '...' } }
    if (typeof data.data?.message === "string" && data.data.message.trim()) {
      return data.data.message;
    }
  }

  // Standard Error object
  if (
    error?.message &&
    typeof error.message === "string" &&
    error.message.trim()
  ) {
    return error.message;
  }

  return fallback;
};

/**
 * Determines if an error message is related to email validation/existence.
 * Useful for showing inline email field errors.
 *
 * @param {string} message - The error message to check
 * @returns {boolean} True if the error is email-related
 */
export const isEmailRelatedError = (message) => {
  if (typeof message !== "string") return false;
  const lowerMessage = message.toLowerCase();
  return (
    lowerMessage.includes("email") ||
    lowerMessage.includes("already exists") ||
    lowerMessage.includes("already registered")
  );
};
