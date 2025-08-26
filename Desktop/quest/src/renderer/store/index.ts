import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../services/api';
import executionReducer from '../features/ExecutionManagement/store/executionSlice';
import commentReducer from '../features/ExecutionManagement/store/commentSlice';
import notificationReducer from './notificationSlice';
import dashboardLayoutReducer from './dashboardLayoutSlice';
import animationReducer from './animationSlice';
import navigationReducer from './navigationSlice';
import testPlanReducer from './testPlanSlice';

import { undoRedoMiddleware } from './undoRedoMiddleware';

export type UserRole = 'ADMIN' | 'QA' | 'DEV' | 'PM';
export interface UserState {
  me: null | { id: number; username: string; role: UserRole };
}

// 가져온 테스트 폴더 상태 타입 정의
export interface ImportedFolder {
  id: number;
  name: string;
  description: string;
  parent_id: number | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  depth: number;
  path: number[];
  source_table: string;
  testCaseCount: number;
}

export interface ImportedFoldersState {
  foldersByRelease: {
    [releaseId: string]: ImportedFolder[];
  };
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

// 가져온 테스트 폴더 슬라이스
const importedFoldersSlice = createSlice({
  name: 'importedFolders',
  initialState: { foldersByRelease: {} } as ImportedFoldersState,
  reducers: {
    setImportedFolders: (state, action: PayloadAction<{ releaseId: string; folders: ImportedFolder[] }>) => {
      state.foldersByRelease[action.payload.releaseId] = action.payload.folders;
    },
    addImportedFolder: (state, action: PayloadAction<{ releaseId: string; folder: ImportedFolder }>) => {
      const { releaseId, folder } = action.payload;
      if (!state.foldersByRelease[releaseId]) {
        state.foldersByRelease[releaseId] = [];
      }
      // 중복 방지
      const exists = state.foldersByRelease[releaseId].find(f => f.id === folder.id);
      if (!exists) {
        state.foldersByRelease[releaseId].push(folder);
      }
    },
    removeImportedFolder: (state, action: PayloadAction<{ releaseId: string; folderId: number }>) => {
      const { releaseId, folderId } = action.payload;
      if (state.foldersByRelease[releaseId]) {
        state.foldersByRelease[releaseId] = state.foldersByRelease[releaseId].filter(folder => folder.id !== folderId);
      }
    },
    clearImportedFolders: (state, action: PayloadAction<string>) => {
      const releaseId = action.payload;
      state.foldersByRelease[releaseId] = [];
    },
    clearAllImportedFolders: (state) => {
      state.foldersByRelease = {};
    }
  }
});

export const { setMe, logout } = userSlice.actions;
export const { 
  setImportedFolders, 
  addImportedFolder, 
  removeImportedFolder, 
  clearImportedFolders,
  clearAllImportedFolders
} = importedFoldersSlice.actions;

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
    importedFolders: importedFoldersSlice.reducer,
    testPlan: testPlanReducer,

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