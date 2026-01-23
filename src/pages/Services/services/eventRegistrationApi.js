/**
 * API Service for Event Registration
 * Handles all API calls related to event interest registration
 */

import Cookies from "js-cookie";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const AUTH_TOKEN_KEY = "sx_auth";

/**
 * Submit event registration data to the backend
 * @param {Object} registrationData - The form data from event registration
 * @returns {Promise<Object>} Response from the API
 */
export const submitEventRegistration = async (registrationData) => {
  try {
    // include auth token if present
    // Import dynamically or assume it's available if top-level import exists
    const token = Cookies.get(AUTH_TOKEN_KEY);

    const response = await fetch(`${API_BASE_URL}/event-interest/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(registrationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    const data = await response.json();
    return {
      success: true,
      data: data,
      message: "Registration successful",
    };
  } catch (error) {
    console.error("Event registration API error:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
      message: "Registration failed",
    };
  }
};

/**
 * Fetch available events for registration
 * @returns {Promise<Array>} List of available events
 */
export const getAvailableEvents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/available`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }

    const data = await response.json();
    return {
      success: true,
      data: data.events || [],
      message: "Events fetched successfully",
    };
  } catch (error) {
    console.error("Fetch events API error:", error);
    return {
      success: false,
      error: error.message,
      data: [],
      message: "Failed to fetch events",
    };
  }
};

/**
 * Check if user has already registered for an event
 * @param {string} email - User's email address
 * @param {string} eventId - Event identifier
 * @returns {Promise<Object>} Registration status
 */
export const checkExistingRegistration = async (email, eventId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/event-registration/check?email=${encodeURIComponent(email)}&eventId=${encodeURIComponent(eventId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to check registration status");
    }

    const data = await response.json();
    return {
      success: true,
      isRegistered: data.isRegistered || false,
      registrationDate: data.registrationDate || null,
    };
  } catch (error) {
    console.error("Check registration API error:", error);
    return {
      success: false,
      error: error.message,
      isRegistered: false,
    };
  }
};

// Re-import Cookies since we need it here, or rely on it being imported at top

/**
 * Get event interest status for a specific event
 * @param {string} eventId - Event identifier
 * @returns {Promise<Object>} Registration status
 */
export const getEventInterestStatus = async (eventId) => {
  try {
    // Import dynamically or assume it's available if top-level import exists
    // Looking at the file, it has 'import Cookies from "js-cookie";' at top
    const token = Cookies.get(AUTH_TOKEN_KEY);

    if (!token) {
      return {
        success: false,
        error: "Authentication required",
        data: { isRegistered: false },
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/event-interest/status/${eventId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to check status");
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data || { isRegistered: false },
    };
  } catch (error) {
    console.error("Event interest status API error:", error);
    return {
      success: false,
      error: error.message,
      data: { isRegistered: false },
    };
  }
};

/**
 * Get registration statistics (admin only)
 * @returns {Promise<Object>} Registration statistics
 */
export const getRegistrationStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/event-registration/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add authentication token
        // 'Authorization': `Bearer ${getAuthToken()}`
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch statistics");
    }

    const data = await response.json();
    return {
      success: true,
      data: data,
      message: "Statistics fetched successfully",
    };
  } catch (error) {
    console.error("Fetch stats API error:", error);
    return {
      success: false,
      error: error.message,
      data: null,
      message: "Failed to fetch statistics",
    };
  }
};

export default {
  submitEventRegistration,
  getAvailableEvents,
  checkExistingRegistration,
  getEventInterestStatus,
  getRegistrationStats,
};
