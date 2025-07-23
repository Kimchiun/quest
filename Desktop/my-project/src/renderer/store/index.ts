import { configureStore } from '@reduxjs/toolkit';
import testCaseReducer from '../features/TestCaseManagement/store/testCaseSlice';
import releaseReducer from '../features/ReleasePlanning/store/releaseSlice';

export const store = configureStore({
  reducer: {
    testcases: testCaseReducer,
    releases: releaseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 