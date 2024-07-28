// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import uiSlice from './slices/uiSlice';

const rootReducer = {
  auth: authSlice,
  ui: uiSlice,
};

export const store = configureStore({
  reducer: rootReducer,
});

export default rootReducer;
