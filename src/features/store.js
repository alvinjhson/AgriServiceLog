import { configureStore } from '@reduxjs/toolkit';
import someReducer from './someSlice'; // Replace with your slice file

export const store = configureStore({
  reducer: {
    some: someReducer, // Add your reducers here
  },
});
