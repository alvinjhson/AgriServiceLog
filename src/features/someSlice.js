import { configureStore } from '@reduxjs/toolkit';
import someReducer from './someSlice'; 

export const store = configureStore({
  reducer: {
    someFeature: someReducer, 
  },
});

export default store;
