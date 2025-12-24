import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const searchCourses = createAsyncThunk(
    'search/searchCourses',
    async ({ searchTerm, page = 1 }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/courses/search?title=${encodeURIComponent(searchTerm)}&page=${page}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Search failed');
        }
    }
);

const initialState = {
    results: [],
    searchTerm: '',
    pagination: {},
    loading: false,
    error: null,
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        clearSearch: (state) => {
            state.results = [];
            state.searchTerm = '';
            state.pagination = {};
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.results = action.payload.data.courses;
                state.pagination = action.payload.data.pagination;
            })
            .addCase(searchCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setSearchTerm, clearSearch, clearError } = searchSlice.actions;
export default searchSlice.reducer; 