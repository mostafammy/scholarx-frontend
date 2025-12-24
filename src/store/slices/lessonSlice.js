import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchCourseLessons = createAsyncThunk(
    'lessons/fetchCourseLessons',
    async (courseId, { rejectWithValue }) => {
        try {
            // Fetch both course details and lessons
            const [courseResponse, lessonsResponse] = await Promise.all([
                api.get(`/courses/${courseId}`),
                api.get(`/lessons/courses/${courseId}/lessons`)
            ]);
            
            return {
                course: courseResponse.data.data.course,
                lessons: lessonsResponse.data.data.lessons
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch course data');
        }
    }
);

export const checkCourseSubscription = createAsyncThunk(
    'lessons/checkSubscription',
    async ({ courseId, userId }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/courses/${courseId}/subscription-status`, {
                params: { userId }
            });
            
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to check subscription');
        }
    }
);

export const markLessonComplete = createAsyncThunk(
    'lessons/markComplete',
    async ({ lessonId, courseId }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/lessons/${lessonId}/complete`, { courseId });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to mark lesson complete');
        }
    }
);

export const fetchCompletedLessons = createAsyncThunk(
    'lessons/fetchCompleted',
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/lessons/courses/${courseId}/completed`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch completed lessons');
        }
    }
);

const initialState = {
    sections: [],
    currentLesson: null,
    completedLessons: [],
    course: null,
    isSubscribed: false,
    isBlocked: false,
    loading: false,
    error: null,
};

const lessonSlice = createSlice({
    name: 'lessons',
    initialState,
    reducers: {
        setCurrentLesson: (state, action) => {
            state.currentLesson = action.payload;
        },
        clearCurrentLesson: (state) => {
            state.currentLesson = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearCourseData: (state) => {
            state.sections = [];
            state.currentLesson = null;
            state.completedLessons = [];
            state.course = null;
            state.isSubscribed = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Course Lessons
            .addCase(fetchCourseLessons.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourseLessons.fulfilled, (state, action) => {
                state.loading = false;
                state.course = action.payload.course;
                
                // Group lessons by section
                const grouped = {};
                action.payload.lessons.forEach(lesson => {
                    const sectionTitle = lesson.section || 'General';
                    if (!grouped[sectionTitle]) grouped[sectionTitle] = [];
                    grouped[sectionTitle].push(lesson);
                });
                state.sections = Object.entries(grouped).map(([title, lessons], idx) => ({
                    title,
                    lessons,
                    index: idx + 1
                }));
                
                // Set first lesson as current by default
                if (state.sections.length && state.sections[0].lessons.length) {
                    state.currentLesson = state.sections[0].lessons[0];
                }
            })
            .addCase(fetchCourseLessons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Check Subscription
            .addCase(checkCourseSubscription.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkCourseSubscription.fulfilled, (state, action) => {
                state.loading = false;
                state.isSubscribed = action.payload.isSubscribed;
            })
            .addCase(checkCourseSubscription.rejected, (state, action) => {
                state.loading = false;
                state.isSubscribed = false;
                state.error = action.payload;
                // Check if user is blocked
                if (action.payload && action.payload.includes && action.payload.includes('blocked')) {
                    state.isBlocked = true;
                }
            })
            // Mark Lesson Complete
            .addCase(markLessonComplete.fulfilled, (state, action) => {
                state.completedLessons.push(action.payload.data.lessonId);
            })
            // Fetch Completed Lessons
            .addCase(fetchCompletedLessons.fulfilled, (state, action) => {
                state.completedLessons = action.payload.data.completedLessons;
            });
    },
});

export const { setCurrentLesson, clearCurrentLesson, clearError, clearCourseData } = lessonSlice.actions;
export default lessonSlice.reducer; 