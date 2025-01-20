import { configureStore } from '@reduxjs/toolkit';
import someReducer from './someSlice'; // Import the reducer from a slice file

// Configure the Redux store
export const store = configureStore({
  reducer: {
    someFeature: someReducer, // Add reducers here
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>; // The type of the entire state tree
export type AppDispatch = typeof store.dispatch; // The type of the store's dispatch function

export default store;
