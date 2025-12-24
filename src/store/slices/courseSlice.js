import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchLatestCourses = createAsyncThunk(
    'courses/fetchLatest',
    async (page = 1, { rejectWithValue }) => {
        try {
            const response = await api.get(`/courses?page=${page}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch latest courses');
        }
    }
);

export const fetchFeaturedCourses = createAsyncThunk(
    'courses/fetchFeatured',
    async (page = 1, { rejectWithValue }) => {
        try {
            const response = await api.get(`/courses?category=Featured&page=${page}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured courses');
        }
    }
);

export const fetchScholarXCourses = createAsyncThunk(
    'courses/fetchScholarX',
    async (page = 1, { rejectWithValue }) => {
        try {
            const response = await api.get(`/courses?category=ScholarX&page=${page}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch ScholarX courses');
        }
    }
);

export const fetchCourseDetails = createAsyncThunk(
    'courses/fetchDetails',
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/courses/${courseId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch course details');
        }
    }
);

const initialState = {
    latest: [],
    featured: [],
    scholarx: [],
    currentCourse: null,
    latestPagination: {},
    featuredPagination: {},
    scholarxPagination: {},
    loading: false,
    error: null,
};

const courseSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        clearCurrentCourse: (state) => {
            state.currentCourse = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Latest Courses
            .addCase(fetchLatestCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLatestCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.latest = action.payload.data.courses;
                state.latestPagination = action.payload.data.pagination;
            })
            .addCase(fetchLatestCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Featured Courses
            .addCase(fetchFeaturedCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFeaturedCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.featured = action.payload.data.courses;
                state.featuredPagination = action.payload.data.pagination;
            })
            .addCase(fetchFeaturedCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // ScholarX Courses
            .addCase(fetchScholarXCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchScholarXCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.scholarx = action.payload.data.courses;
                state.scholarxPagination = action.payload.data.pagination;
            })
            .addCase(fetchScholarXCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Course Details
            .addCase(fetchCourseDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourseDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCourse = action.payload.data.course;
            })
            .addCase(fetchCourseDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentCourse, clearError } = courseSlice.actions;
export default courseSlice.reducer; 