import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
// import userReducer from './slices/userSlice';
import courseReducer from './slices/courseSlice.js';
// import subscriptionReducer from './slices/subscriptionSlice';
import adminReducer from './slices/adminSlice.js';
import lessonReducer from './slices/lessonSlice.js';
import searchReducer from './slices/searchSlice.js';
import uiReducer from './slices/uiSlice.js';
import certificateReducer from './slices/certificateSlice.js';

const store = configureStore({
    reducer: {
        auth: authReducer,
        // user: userReducer,
        course: courseReducer,
        // subscription: subscriptionReducer,
        admin: adminReducer,
        lessons: lessonReducer,
        search: searchReducer,
        ui: uiReducer,
        certificates: certificateReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store; 