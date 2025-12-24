import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import Cookies from "js-cookie";

const AUTH_TOKEN_KEY = "sx_auth";

const createEmptyPagination = () => ({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
});

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  "admin/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      // #region agent log
      fetch(
        "http://127.0.0.1:7242/ingest/4b8c686f-b237-4ff5-a74e-1c2aac42233b",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: "debug-session",
            runId: "run1",
            hypothesisId: "H1",
            location: "adminSlice.js:fetchDashboardStats",
            message: "fetchDashboardStats start",
            data: {
              baseURL: api.defaults.baseURL,
              path: "/admin/dashboard/stats",
            },
            timestamp: Date.now(),
          }),
        }
      ).catch(() => {});
      // #endregion
      const response = await api.get("/admin/dashboard/stats");
      // #region agent log
      fetch(
        "http://127.0.0.1:7242/ingest/4b8c686f-b237-4ff5-a74e-1c2aac42233b",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: "debug-session",
            runId: "run1",
            hypothesisId: "H2",
            location: "adminSlice.js:fetchDashboardStats",
            message: "fetchDashboardStats success",
            data: {
              status: response.status,
              keys: Object.keys(response.data || {}),
            },
            timestamp: Date.now(),
          }),
        }
      ).catch(() => {});
      // #endregion
      return response.data.data;
    } catch (error) {
      // #region agent log
      fetch(
        "http://127.0.0.1:7242/ingest/4b8c686f-b237-4ff5-a74e-1c2aac42233b",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: "debug-session",
            runId: "run1",
            hypothesisId: "H3",
            location: "adminSlice.js:fetchDashboardStats",
            message: "fetchDashboardStats error",
            data: {
              status: error.response?.status,
              path: error.config?.url,
              msg: error.response?.data?.message || error.message,
            },
            timestamp: Date.now(),
          }),
        }
      ).catch(() => {});
      // #endregion
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard stats"
      );
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async ({ page = 1, search = "" }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/admin/users?page=${page}&search=${search}`
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/users/${userId}`, userData);
      return response.data.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user"
      );
    }
  }
);

export const blockUser = createAsyncThunk(
  "admin/blockUser",
  async ({ userId, reason }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/block`, {
        reason,
      });
      return response.data.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to block user"
      );
    }
  }
);

export const unblockUser = createAsyncThunk(
  "admin/unblockUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/unblock`);
      return response.data.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to unblock user"
      );
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  "admin/updateUserStatus",
  async ({ userId, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/status`, {
        status,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user status"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      return userId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

export const fetchAllCourses = createAsyncThunk(
  "admin/fetchAllCourses",
  async ({ page = 1, search = "" }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/admin/courses?page=${page}&search=${search}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch courses"
      );
    }
  }
);

export const createCourse = createAsyncThunk(
  "admin/createCourse",
  async (courseData, { rejectWithValue }) => {
    try {
      let dataToSend = courseData;
      let config = {};
      if (courseData.image && courseData.image.file) {
        const formData = new FormData();
        formData.append("title", courseData.title);
        formData.append("description", courseData.description);
        formData.append("category", courseData.category);
        formData.append("currentPrice", courseData.currentPrice);
        if (courseData.oldPrice)
          formData.append("oldPrice", courseData.oldPrice);
        if (courseData.instructor)
          formData.append("instructor", courseData.instructor);
        formData.append("image", courseData.image.file);
        dataToSend = formData;
        config = { headers: { "Content-Type": "multipart/form-data" } };
      }
      const response = await api.post("/admin/courses", dataToSend, config);
      return response.data.data.course;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create course"
      );
    }
  }
);

export const updateCourse = createAsyncThunk(
  "admin/updateCourse",
  async ({ courseId, courseData }, { rejectWithValue }) => {
    try {
      let dataToSend = courseData;
      let config = {};
      if (courseData.image && courseData.image.file) {
        const formData = new FormData();
        formData.append("title", courseData.title);
        formData.append("description", courseData.description);
        formData.append("category", courseData.category);
        formData.append("currentPrice", courseData.currentPrice);
        if (courseData.oldPrice)
          formData.append("oldPrice", courseData.oldPrice);
        if (courseData.instructor)
          formData.append("instructor", courseData.instructor);
        formData.append("image", courseData.image.file);
        dataToSend = formData;
        config = { headers: { "Content-Type": "multipart/form-data" } };
      }
      const response = await api.patch(
        `/admin/courses/${courseId}`,
        dataToSend,
        config
      );
      return response.data.data.course;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update course"
      );
    }
  }
);

export const updateCourseStatus = createAsyncThunk(
  "admin/updateCourseStatus",
  async ({ courseId, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/courses/${courseId}/status`, {
        status,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update course status"
      );
    }
  }
);

export const deleteCourse = createAsyncThunk(
  "admin/deleteCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/courses/${courseId}`);
      return courseId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete course"
      );
    }
  }
);

// Manual enrollment overrides
export const enrollUserToCourse = createAsyncThunk(
  "admin/enrollUserToCourse",
  async ({ courseId, userId, email }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/admin/courses/${courseId}/enroll`, {
        userId,
        email,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to enroll user"
      );
    }
  }
);

export const revokeUserFromCourse = createAsyncThunk(
  "admin/revokeUserFromCourse",
  async ({ courseId, userId, email }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/courses/${courseId}/enroll`, {
        params: { userId, email },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to revoke access"
      );
    }
  }
);

export const createLesson = createAsyncThunk(
  "admin/createLesson",
  async ({ courseId, lessonData }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/admin/courses/${courseId}/lessons`,
        lessonData
      );
      return response.data.data.lesson;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create lesson"
      );
    }
  }
);

export const updateLesson = createAsyncThunk(
  "admin/updateLesson",
  async ({ lessonId, lessonData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/lessons/${lessonId}`, lessonData);
      return response.data.data.lesson;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update lesson"
      );
    }
  }
);

export const deleteLesson = createAsyncThunk(
  "admin/deleteLesson",
  async ({ lessonId, courseId }, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/lessons/${lessonId}`);
      return { lessonId, courseId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete lesson"
      );
    }
  }
);

export const fetchSubscriptions = createAsyncThunk(
  "admin/fetchSubscriptions",
  async (params, { rejectWithValue }) => {
    try {
      const query = {};
      const page = params?.page;
      const limit = params?.limit;

      if (typeof page === "number") {
        query.page = page;
      }

      if (typeof limit === "number") {
        query.limit = limit;
      }

      const response = await api.get("/admin/subscriptions", {
        params: Object.keys(query).length ? query : undefined,
      });

      const rawData = response.data?.data;
      const basePagination = createEmptyPagination();
      const limitValue =
        typeof limit === "number" ? limit : basePagination.limit;

      if (Array.isArray(rawData)) {
        return {
          list: rawData,
          pagination: {
            ...basePagination,
            total: rawData.length,
            limit: limitValue,
            totalPages:
              limitValue > 0 ? Math.ceil(rawData.length / limitValue) : 0,
          },
        };
      }

      const normalizedList = Array.isArray(rawData?.items) ? rawData.items : [];
      const normalizedPagination = rawData?.pagination
        ? { ...basePagination, ...rawData.pagination }
        : basePagination;

      return {
        list: normalizedList,
        pagination: normalizedPagination,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subscriptions"
      );
    }
  }
);

export const updateSubscription = createAsyncThunk(
  "admin/updateSubscription",
  async ({ subscriptionId, subscriptionData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/admin/subscriptions/${subscriptionId}`,
        subscriptionData
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update subscription"
      );
    }
  }
);

export const fetchReports = createAsyncThunk(
  "admin/fetchReports",
  async ({ type, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/reports/${type}`, {
        params: { startDate, endDate },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reports"
      );
    }
  }
);

const initialState = {
  dashboardStats: null,
  users: {
    list: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  },
  courses: {
    list: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  },
  subscriptions: {
    list: [],
    pagination: createEmptyPagination(),
  },
  reports: {},
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.users.findIndex(
          (user) => user._id === action.payload._id
        );
        if (index !== -1) {
          state.users.users[index] = action.payload;
        }
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        const index = state.users.users.findIndex(
          (user) => user._id === action.payload._id
        );
        if (index !== -1) {
          state.users.users[index] = action.payload;
        }
      })
      .addCase(unblockUser.fulfilled, (state, action) => {
        const index = state.users.users.findIndex(
          (user) => user._id === action.payload._id
        );
        if (index !== -1) {
          state.users.users[index] = action.payload;
        }
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const index = state.users.users.findIndex(
          (user) => user._id === action.payload._id
        );
        if (index !== -1) {
          state.users.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users.users = state.users.users.filter(
          (user) => user._id !== action.payload
        );
      })
      // Courses
      .addCase(fetchAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.list = action.payload.courses || [];
        state.courses.pagination =
          action.payload.pagination || state.courses.pagination;
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        if (Array.isArray(state.courses.list)) {
          state.courses.list.unshift(action.payload);
        }
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        if (Array.isArray(state.courses.list)) {
          const index = state.courses.list.findIndex(
            (course) => course._id === action.payload._id
          );
          if (index !== -1) {
            state.courses.list[index] = action.payload;
          }
        }
      })
      .addCase(updateCourseStatus.fulfilled, (state, action) => {
        const index = state.courses.list.findIndex(
          (course) => course._id === action.payload._id
        );
        if (index !== -1) {
          state.courses.list[index] = action.payload;
        }
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses.list = state.courses.list.filter(
          (course) => course._id !== action.payload
        );
      })
      // Manual enrollment overrides
      .addCase(enrollUserToCourse.fulfilled, (state, action) => {
        const updated = action.payload.course;
        const index = state.courses.list.findIndex(
          (c) => c._id === updated._id
        );
        if (index !== -1) {
          state.courses.list[index] = {
            ...state.courses.list[index],
            ...updated,
          };
        }
      })
      .addCase(revokeUserFromCourse.fulfilled, (state, action) => {
        const updated = action.payload.course;
        const index = state.courses.list.findIndex(
          (c) => c._id === updated._id
        );
        if (index !== -1) {
          state.courses.list[index] = {
            ...state.courses.list[index],
            ...updated,
          };
        }
      })
      // Lessons
      .addCase(createLesson.fulfilled, (state, action) => {
        const courseIndex = state.courses.list.findIndex(
          (course) => course._id === action.meta.arg.courseId
        );
        if (courseIndex !== -1) {
          const course = state.courses.list[courseIndex];
          if (Array.isArray(course.lessons)) {
            course.lessons.push(action.payload);
          } else {
            course.lessons = [action.payload];
          }
          course.totalLessons = (course.totalLessons || 0) + 1;
          course.totalDuration =
            (course.totalDuration || 0) + (action.payload.duration || 0);
        }
      })
      .addCase(updateLesson.fulfilled, (state, action) => {
        const courseIndex = state.courses.list.findIndex(
          (course) => course._id === action.meta.arg.courseId
        );
        if (courseIndex !== -1) {
          const course = state.courses.list[courseIndex];
          if (Array.isArray(course.lessons)) {
            const lessonIndex = course.lessons.findIndex(
              (lesson) => lesson._id === action.meta.arg.lessonId
            );
            if (lessonIndex !== -1) {
              course.lessons[lessonIndex] = action.payload;
            }
          }
        }
      })
      .addCase(deleteLesson.fulfilled, (state, action) => {
        const courseIndex = state.courses.list.findIndex(
          (course) => course._id === action.payload.courseId
        );
        if (courseIndex !== -1) {
          const course = state.courses.list[courseIndex];
          course.lessons = course.lessons.filter(
            (lesson) => lesson._id !== action.payload.lessonId
          );
          course.totalLessons = (course.totalLessons || 0) - 1;
          course.totalDuration =
            (course.totalDuration || 0) - (action.payload.lesson.duration || 0);
        }
      })
      // Subscriptions
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions.list = action.payload.list;
        state.subscriptions.pagination = action.payload.pagination;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        if (!Array.isArray(state.subscriptions.list)) {
          state.subscriptions.list = [];
        }
        const index = state.subscriptions.list.findIndex(
          (sub) => sub._id === action.payload._id
        );
        if (index !== -1) {
          state.subscriptions.list[index] = action.payload;
        }
      })
      // Reports
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = {
          ...state.reports,
          [action.meta.arg.type]: action.payload,
        };
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
