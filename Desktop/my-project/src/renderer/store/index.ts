import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../services/api';
import executionReducer from '../features/ExecutionManagement/store/executionSlice';
import commentReducer from '../features/ExecutionManagement/store/commentSlice';
import notificationReducer from './notificationSlice';
import dashboardLayoutReducer from './dashboardLayoutSlice';
import animationReducer from './animationSlice';
import navigationReducer from './navigationSlice';

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
    // RTK Query API
    [api.reducerPath]: api.reducer,
    
    // 기존 슬라이스들
    executions: executionReducer,
    comments: commentReducer,
    notifications: notificationReducer,
    dashboardLayout: dashboardLayoutReducer,
    animation: animationReducer,
    navigation: navigationReducer,
    users: userSlice.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
    .concat(api.middleware)
    .concat(undoRedoMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 