import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Async thunks
export const fetchCompletedCourses = createAsyncThunk(
  "certificates/fetchCompletedCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/completion/completed-courses");
      return response.data.data.completedCourses;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch completed courses",
      );
    }
  },
);

export const markLessonComplete = createAsyncThunk(
  "certificates/markLessonComplete",
  async (
    { lessonId, courseId, watchTime, completionPercentage },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/completion/lessons/complete", {
        lessonId,
        courseId,
        watchTime,
        completionPercentage,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark lesson as complete",
      );
    }
  },
);

export const getCompletedLessons = createAsyncThunk(
  "certificates/getCompletedLessons",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/completion/courses/${courseId}/completed-lessons`,
      );
      return {
        courseId,
        completedLessons: response.data.data.completedLessons,
        completions: response.data.data.completions,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch completed lessons",
      );
    }
  },
);

export const getCourseCompletionStatus = createAsyncThunk(
  "certificates/getCourseCompletionStatus",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/completion/courses/${courseId}/completion-status`,
      );
      return {
        courseId,
        ...response.data.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch course completion status",
      );
    }
  },
);

export const fetchCertificateData = createAsyncThunk(
  "certificates/fetchCertificateData",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/completion/courses/${courseId}/certificate`,
      );
      // Include courseId in the response for caching
      return { ...response.data.data.certificate, courseId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch certificate data",
      );
    }
  },
);

const initialState = {
  completedCourses: [],
  completedLessons: {}, // courseId -> array of completed lesson IDs
  courseCompletionStatus: {}, // courseId -> completion status
  certificateCache: {}, // courseId -> certificate data for caching
  // Per-operation loading states to prevent UI flickering
  loadingCourses: false,
  loadingLessonComplete: false,
  loadingCompletedLessons: false,
  loadingCompletionStatus: false,
  loadingCertificate: false,
  error: null,
};

const certificateSlice = createSlice({
  name: "certificates",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCompletedLessons: (state, action) => {
      const courseId = action.payload;
      delete state.completedLessons[courseId];
    },
    clearCourseCompletionStatus: (state, action) => {
      const courseId = action.payload;
      delete state.courseCompletionStatus[courseId];
    },
    clearCertificateCache: (state, action) => {
      if (action.payload) {
        delete state.certificateCache[action.payload];
      } else {
        state.certificateCache = {};
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Completed Courses
      .addCase(fetchCompletedCourses.pending, (state) => {
        state.loadingCourses = true;
        state.error = null;
      })
      .addCase(fetchCompletedCourses.fulfilled, (state, action) => {
        state.loadingCourses = false;
        state.completedCourses = action.payload;
      })
      .addCase(fetchCompletedCourses.rejected, (state, action) => {
        state.loadingCourses = false;
        state.error = action.payload;
      })
      // Mark Lesson Complete
      .addCase(markLessonComplete.pending, (state) => {
        state.loadingLessonComplete = true;
        state.error = null;
      })
      .addCase(markLessonComplete.fulfilled, (state, action) => {
        state.loadingLessonComplete = false;
        const { courseId, lessonId } = action.payload.completion;

        // Add to completed lessons for this course
        if (!state.completedLessons[courseId]) {
          state.completedLessons[courseId] = [];
        }
        if (!state.completedLessons[courseId].includes(lessonId)) {
          state.completedLessons[courseId].push(lessonId);
        }

        // Update course completion status
        if (state.courseCompletionStatus[courseId]) {
          state.courseCompletionStatus[courseId].completedLessons += 1;
          const totalLessons =
            state.courseCompletionStatus[courseId].totalLessons;
          state.courseCompletionStatus[courseId].completionPercentage =
            Math.round(
              (state.courseCompletionStatus[courseId].completedLessons /
                totalLessons) *
                100,
            );
        }
      })
      .addCase(markLessonComplete.rejected, (state, action) => {
        state.loadingLessonComplete = false;
        state.error = action.payload;
      })
      // Get Completed Lessons
      .addCase(getCompletedLessons.pending, (state) => {
        state.loadingCompletedLessons = true;
        state.error = null;
      })
      .addCase(getCompletedLessons.fulfilled, (state, action) => {
        state.loadingCompletedLessons = false;
        const { courseId, completedLessons } = action.payload;
        state.completedLessons[courseId] = completedLessons;
      })
      .addCase(getCompletedLessons.rejected, (state, action) => {
        state.loadingCompletedLessons = false;
        state.error = action.payload;
      })
      // Get Course Completion Status
      .addCase(getCourseCompletionStatus.pending, (state) => {
        state.loadingCompletionStatus = true;
        state.error = null;
      })
      .addCase(getCourseCompletionStatus.fulfilled, (state, action) => {
        state.loadingCompletionStatus = false;
        const { courseId, ...status } = action.payload;
        state.courseCompletionStatus[courseId] = status;
      })
      .addCase(getCourseCompletionStatus.rejected, (state, action) => {
        state.loadingCompletionStatus = false;
        state.error = action.payload;
      })
      // Fetch Certificate Data (read-only, certificate is auto-generated by Mongoose pre-save hook)
      .addCase(fetchCertificateData.pending, (state) => {
        state.loadingCertificate = true;
        state.error = null;
      })
      .addCase(fetchCertificateData.fulfilled, (state, action) => {
        state.loadingCertificate = false;
        const certificate = action.payload;
        if (certificate?.courseId) {
          state.certificateCache[certificate.courseId] = certificate;
        }
      })
      .addCase(fetchCertificateData.rejected, (state, action) => {
        state.loadingCertificate = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearCompletedLessons,
  clearCourseCompletionStatus,
  clearCertificateCache,
} = certificateSlice.actions;
export default certificateSlice.reducer;
