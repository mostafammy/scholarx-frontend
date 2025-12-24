import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
    error: null,
    success: null,
    sidebarOpen: false,
    modal: {
        isOpen: false,
        type: null,
        data: null,
    },
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setSuccess: (state, action) => {
            state.success = action.payload;
        },
        clearMessages: (state) => {
            state.error = null;
            state.success = null;
        },
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        openModal: (state, action) => {
            state.modal = {
                isOpen: true,
                type: action.payload.type,
                data: action.payload.data,
            };
        },
        closeModal: (state) => {
            state.modal = {
                isOpen: false,
                type: null,
                data: null,
            };
        },
    },
});

export const {
    setLoading,
    setError,
    setSuccess,
    clearMessages,
    toggleSidebar,
    openModal,
    closeModal,
} = uiSlice.actions;

export default uiSlice.reducer; 