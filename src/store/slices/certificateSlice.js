import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchCompletedCourses = createAsyncThunk(
    'certificates/fetchCompletedCourses',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/completion/completed-courses');
            return response.data.data.completedCourses;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch completed courses');
        }
    }
);

export const markLessonComplete = createAsyncThunk(
    'certificates/markLessonComplete',
    async ({ lessonId, courseId, watchTime, completionPercentage }, { rejectWithValue }) => {
        try {
            const response = await api.post('/completion/lessons/complete', {
                lessonId,
                courseId,
                watchTime,
                completionPercentage
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to mark lesson as complete');
        }
    }
);

export const getCompletedLessons = createAsyncThunk(
    'certificates/getCompletedLessons',
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/completion/courses/${courseId}/completed-lessons`);
            return {
                courseId,
                completedLessons: response.data.data.completedLessons,
                completions: response.data.data.completions
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch completed lessons');
        }
    }
);

export const getCourseCompletionStatus = createAsyncThunk(
    'certificates/getCourseCompletionStatus',
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/completion/courses/${courseId}/completion-status`);
            return {
                courseId,
                ...response.data.data
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch course completion status');
        }
    }
);

export const generateCertificate = createAsyncThunk(
    'certificates/generateCertificate',
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/completion/courses/${courseId}/certificate`);
            return response.data.data.certificate;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to generate certificate');
        }
    }
);

const initialState = {
    completedCourses: [],
    completedLessons: {}, // courseId -> array of completed lesson IDs
    courseCompletionStatus: {}, // courseId -> completion status
    loading: false,
    error: null,
};

const certificateSlice = createSlice({
    name: 'certificates',
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
    },
    extraReducers: (builder) => {
        builder
            // Fetch Completed Courses
            .addCase(fetchCompletedCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCompletedCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.completedCourses = action.payload;
            })
            .addCase(fetchCompletedCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Mark Lesson Complete
            .addCase(markLessonComplete.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(markLessonComplete.fulfilled, (state, action) => {
                state.loading = false;
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
                    const totalLessons = state.courseCompletionStatus[courseId].totalLessons;
                    state.courseCompletionStatus[courseId].completionPercentage = 
                        Math.round((state.courseCompletionStatus[courseId].completedLessons / totalLessons) * 100);
                }
            })
            .addCase(markLessonComplete.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Completed Lessons
            .addCase(getCompletedLessons.fulfilled, (state, action) => {
                const { courseId, completedLessons } = action.payload;
                state.completedLessons[courseId] = completedLessons;
            })
            // Get Course Completion Status
            .addCase(getCourseCompletionStatus.fulfilled, (state, action) => {
                const { courseId, ...status } = action.payload;
                state.courseCompletionStatus[courseId] = status;
            })
            // Generate Certificate
            .addCase(generateCertificate.fulfilled, (state, action) => {
                // Certificate generated successfully
                // Could add certificate data to state if needed
            });
    },
});

export const { clearError, clearCompletedLessons, clearCourseCompletionStatus } = certificateSlice.actions;
export default certificateSlice.reducer;

