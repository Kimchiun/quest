import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import testCaseReducer from '../features/TestCaseManagement/store/testCaseSlice';
import releaseReducer from '../features/ReleasePlanning/store/releaseSlice';
import dashboardReducer from '../features/Dashboard/store/dashboardSlice';
import executionReducer from '../features/ExecutionManagement/store/executionSlice';
import commentReducer from '../features/ExecutionManagement/store/commentSlice';
import notificationReducer from '../features/ExecutionManagement/store/notificationSlice';
import selectionReducer from '../features/TestCaseManagement/store/selectionSlice';
import dashboardLayoutReducer from './dashboardLayoutSlice';
import animationReducer from './animationSlice';
import { undoRedoMiddleware } from './undoRedoMiddleware';

export type UserRole = 'ADMIN' | 'QA' | 'DEV' | 'PM';
export interface UserState {
  me: null | { id: number; username: string; role: UserRole };
}

const userSlice = createSlice({
  name: 'users',
  initialState: { me: null } as UserState,
  reducers: {
    setMe: (state, action: PayloadAction<{ id: number; username: string; role: UserRole }>) => {
      state.me = action.payload;
    },
    logout: (state) => {
      state.me = null;
    }
  }
});

export const { setMe, logout } = userSlice.actions;

export const store = configureStore({
  reducer: {
    testcases: testCaseReducer,
    releases: releaseReducer,
    dashboard: dashboardReducer,
    executions: executionReducer,
    comments: commentReducer,
    notifications: notificationReducer,
    selection: selectionReducer,
    dashboardLayout: dashboardLayoutReducer,
    animation: animationReducer,
    users: userSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    }).concat(undoRedoMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 