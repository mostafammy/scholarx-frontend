import axios from "axios";
import Cookies from "js-cookie";

// Use environment variable with fallback
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Cookie names with obscure names
const AUTH_TOKEN_KEY = "sx_auth";
const USER_ROLE_KEY = "sx_role";

// Cookie options
const isProduction = import.meta.env.MODE === "production";
const cookieOptions = {
  secure: isProduction, // Only send over HTTPS in production
  sameSite: isProduction ? "none" : "lax", // Allow cross-site API calls in prod
  path: "/", // Cookie is available for all paths
  expires: 7, // 7 days
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const parseJSendResponse = (payload, fallbackMessage) => {
  if (payload?.status === "success") {
    return payload.data;
  }
  const error = new Error(payload?.message || fallbackMessage);
  if (payload?.data) {
    error.data = payload.data;
  }
  throw error;
};

const normalizeCoursePrice = (course) => {
  if (!course) return null;
  const candidate =
    course.currentPrice ?? course.price ?? course.amount ?? null;
  if (typeof candidate === "number") {
    return candidate;
  }
  if (typeof candidate === "string" && candidate.trim() !== "") {
    const parsed = Number(candidate);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
};

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = Cookies.get(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove all auth-related cookies
      Cookies.remove(AUTH_TOKEN_KEY, cookieOptions);
      Cookies.remove(USER_ROLE_KEY, cookieOptions);
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const authService = {
  login: async (credentials) => {
    const response = await api.post("/users/login", credentials);

    if (response.data.status === "success") {
      // Set token in cookie with secure options
      Cookies.set(AUTH_TOKEN_KEY, response.data.data.token, cookieOptions);
      // Set user role if available
      if (response.data.data.user?.role) {
        Cookies.set(USER_ROLE_KEY, response.data.data.user.role, cookieOptions);
      }
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post("/users/register", userData);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post("/users/forgot-password", { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    const response = await api.post("/users/reset-password", {
      token,
      newPassword,
    });
    return response.data;
  },

  // Google authentication
  initiateGoogleLogin: () => {
    window.location.href = `${API_URL}/users/google`;
  },

  handleGoogleCallback: async (token) => {
    try {
      if (token) {
        Cookies.set(AUTH_TOKEN_KEY, token, cookieOptions);
        // Get user data to set role
        const userResponse = await api.get("/users/profile");
        if (userResponse.data.data?.user?.role) {
          Cookies.set(
            USER_ROLE_KEY,
            userResponse.data.data.user.role,
            cookieOptions,
          );
        }
        return userResponse;
      }
    } catch (error) {
      console.error("Error handling Google callback:", error);
      throw error;
    }
  },

  logout: () => {
    // Remove all auth-related cookies with secure options
    Cookies.remove(AUTH_TOKEN_KEY, cookieOptions);
    Cookies.remove(USER_ROLE_KEY, cookieOptions);
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get("/users/profile");
      // Update role cookie if available
      if (response.data.data?.user?.role) {
        Cookies.set(USER_ROLE_KEY, response.data.data.user.role, cookieOptions);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateProfile: async (formData) => {
    // If formData is FormData, use axios directly to avoid default headers
    if (formData instanceof FormData) {
      const response = await axios.patch(`${API_URL}/users/profile`, formData, {
        headers: {
          Authorization: `Bearer ${Cookies.get(AUTH_TOKEN_KEY)}`,
          // Do NOT set 'Content-Type' here!
        },
      });

      return response.data;
    } else {
      // fallback for non-FormData
      const response = await api.patch("/users/profile", formData);

      return response.data;
    }
  },

  updatePassword: async (currentPassword, newPassword) => {
    const response = await api.put("/users/update-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
  isAuthenticated: () => {
    return !!Cookies.get(AUTH_TOKEN_KEY);
  },

  createPayment: async (courseId, paymentMethod = "CARD") => {
    try {
      const response = await axios.post(
        `${API_URL}/payments/create/${courseId}`,
        { paymentMethod },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(AUTH_TOKEN_KEY)}`,
          },
        },
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  getPaymentMethods: async () => {
    try {
      const response = await axios.get(`${API_URL}/payments/methods`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyEmail: async (token) => {
    return await axios.get(`${API_URL}/users/verify-email?token=${token}`);
  },
};
const enrollFreeCourseRequest = async (courseId) => {
  const response = await api.post(`/courses/${courseId}/enroll`);
  return parseJSendResponse(response.data, "Failed to enroll in course");
};

const enrollPaidCourseRequest = async (courseId, paymentMethod = "CARD") => {
  const response = await authService.createPayment(courseId, paymentMethod);
  return parseJSendResponse(response.data, "Failed to initiate payment");
};

export const courseService = {
  isFreeCourse(course) {
    const price = normalizeCoursePrice(course);
    return price !== null && price === 0;
  },
  enrollFreeCourse: enrollFreeCourseRequest,
  enrollPaidCourse: enrollPaidCourseRequest,
  async enrollInCourse(courseId, course, paymentMethod = "CARD") {
    return this.isFreeCourse(course)
      ? enrollFreeCourseRequest(courseId)
      : enrollPaidCourseRequest(courseId, paymentMethod);
  },
};

export const programService = {
  // Ambassador Program
  submitAmbassadorApplication: async (data) => {
    const response = await api.post("/programs/ambassador/apply", data);
    return response.data;
  },

  // Mentorship Program
  submitMentorshipRequest: async (data) => {
    const response = await api.post("/programs/mentorship/request", data);
    return response.data;
  },

  // Get application status
  getApplicationStatus: async (id) => {
    const response = await api.get(`/programs/status/${id}`);
    return response.data;
  },

  // Get all applications for current user
  getMyApplications: async () => {
    const response = await api.get("/programs/my-applications");
    return response.data;
  },
};

export const courseEnrollmentService = {
  /**
   * Submit course enrollment application form data
   * POST /api/courses/:id/apply
   * @param {Object} applicationData - The application form data
   * @returns {Promise<Object>} - The API response
   */
  submitApplication: async (applicationData) => {
    const { courseId, ...formData } = applicationData;
    const response = await api.post(`/courses/${courseId}/apply`, formData);
    return parseJSendResponse(response.data, "Failed to submit application");
  },

  /**
   * Check the status of a user's application for a course
   * GET /api/courses/:id/application-status
   * @param {string} courseId - The course ID
   * @returns {Promise<Object>} - The application status data
   */
  getApplicationStatus: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}/application-status`);
      return response.data?.data || null;
    } catch (error) {
      // If endpoint returns 404 or error, return null (no application)
      if (error?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Check if a course requires an application form before enrollment
   * @param {Object} course - The course object
   * @returns {boolean} - Whether the course requires a form
   */
  courseRequiresForm: (course) => {
    return Boolean(course?.requiresForm);
  },
};

/**
 * Sales Inquiry Service
 * Covers all sales inquiry endpoints for both user-facing and dashboard use.
 */
export const salesInquiryService = {
  /**
   * Check if the authenticated user has already submitted an inquiry for a course.
   * GET /api/courses/:id/sales-inquiry/status
   */
  checkInquiryStatus: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/sales-inquiry/status`);
    return parseJSendResponse(response.data, "Failed to fetch inquiry status");
  },

  /**
   * Submit a new sales inquiry for a paid course.
   * POST /api/courses/:id/sales-inquiry
   */
  submitInquiry: async (courseId, payload) => {
    const response = await api.post(
      `/courses/${courseId}/sales-inquiry`,
      payload,
    );
    return parseJSendResponse(response.data, "Failed to submit inquiry");
  },

  /**
   * Get sales dashboard stats (requires sales/admin role).
   * GET /api/sales/dashboard/stats
   */
  getDashboardStats: async () => {
    const response = await api.get("/sales/dashboard/stats");
    return parseJSendResponse(response.data, "Failed to fetch dashboard stats");
  },

  /**
   * List all inquiries with optional filters (requires sales/admin role).
   * GET /api/sales/inquiries
   */
  listInquiries: async (params = {}) => {
    const response = await api.get("/sales/inquiries", { params });
    return parseJSendResponse(response.data, "Failed to fetch inquiries");
  },

  /**
   * Get full details of a single inquiry including message and salesNotes.
   * GET /api/sales/inquiries/:id
   */
  getInquiry: async (id) => {
    const response = await api.get(`/sales/inquiries/${id}`);
    return parseJSendResponse(response.data, "Failed to fetch inquiry");
  },

  /**
   * Update inquiry status and optionally add sales notes.
   * PATCH /api/sales/inquiries/:id/status
   */
  updateInquiryStatus: async (id, payload) => {
    const response = await api.patch(`/sales/inquiries/${id}/status`, payload);
    return parseJSendResponse(response.data, "Failed to update inquiry status");
  },

  /**
   * Enroll the user who submitted an inquiry — grants immediate course access
   * and auto-converts the inquiry to "converted".
   * POST /api/sales/inquiries/:id/enroll
   */
  enrollUser: async (id, payload = {}) => {
    const response = await api.post(`/sales/inquiries/${id}/enroll`, payload);
    return parseJSendResponse(response.data, "Failed to enroll user");
  },

  /**
   * Revoke course access for a converted inquiry (admin only).
   * Reverts inquiry status back to "contacted".
   * DELETE /api/sales/inquiries/:id/enroll
   */
  unenrollUser: async (id, payload) => {
    const response = await api.delete(`/sales/inquiries/${id}/enroll`, {
      data: payload,
    });
    return parseJSendResponse(response.data, "Failed to unenroll user");
  },
};

export default api;
