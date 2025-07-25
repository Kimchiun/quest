import { configureStore } from '@reduxjs/toolkit';
import testCaseReducer from '../features/TestCaseManagement/store/testCaseSlice';
import releaseReducer from '../features/ReleasePlanning/store/releaseSlice';
import executionReducer from '../features/ExecutionManagement/store/executionSlice';
import dashboardReducer from '../features/Dashboard/store/dashboardSlice';
import commentReducer from '../features/ExecutionManagement/store/commentSlice';
import notificationReducer from '../features/ExecutionManagement/store/notificationSlice';
import { notificationMiddleware } from '../features/ExecutionManagement/store/notificationMiddleware';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'ADMIN' | 'QA' | 'DEV' | 'PM';
export interface UserState {
  me: null | { id: number; username: string; role: UserRole };
  isLoggedIn: boolean;
}
const initialUserState: UserState = { me: null, isLoggedIn: false };

const userSlice = createSlice({
  name: 'users',
  initialState: initialUserState,
  reducers: {
    setUser(state, action: PayloadAction<{ id: number; username: string; role: UserRole }>) {
      state.me = action.payload;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.me = null;
      state.isLoggedIn = false;
    },
  },
});
export const { setUser, logout } = userSlice.actions;

export const store = configureStore({
  reducer: {
    testcases: testCaseReducer,
    releases: releaseReducer,
    executions: executionReducer,
    dashboard: dashboardReducer,
    comments: commentReducer,
    notifications: notificationReducer,
    users: userSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(notificationMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 