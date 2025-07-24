import { configureStore } from '@reduxjs/toolkit';
import testCaseReducer from '../features/TestCaseManagement/store/testCaseSlice';
import releaseReducer from '../features/ReleasePlanning/store/releaseSlice';
import executionReducer from '../features/ExecutionManagement/store/executionSlice';
import dashboardReducer from '../features/Dashboard/store/dashboardSlice';
import commentReducer from '../features/ExecutionManagement/store/commentSlice';
import notificationReducer from '../features/ExecutionManagement/store/notificationSlice';
import { notificationMiddleware } from '../features/ExecutionManagement/store/notificationMiddleware';

export const store = configureStore({
  reducer: {
    testcases: testCaseReducer,
    releases: releaseReducer,
    executions: executionReducer,
    dashboard: dashboardReducer,
    comments: commentReducer,
    notifications: notificationReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(notificationMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 