import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectionState {
  selectedFolders: number[];
  selectedTestCases: number[];
  lastSelectedIndex: number | null;
  isSelecting: boolean;
}

const initialState: SelectionState = {
  selectedFolders: [],
  selectedTestCases: [],
  lastSelectedIndex: null,
  isSelecting: false,
};

const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    // 폴더 선택 관련
    selectFolder: (state, action: PayloadAction<number>) => {
      const folderId = action.payload;
      if (!state.selectedFolders.includes(folderId)) {
        state.selectedFolders.push(folderId);
      }
    },
    deselectFolder: (state, action: PayloadAction<number>) => {
      state.selectedFolders = state.selectedFolders.filter(id => id !== action.payload);
    },
    selectFolders: (state, action: PayloadAction<number[]>) => {
      state.selectedFolders = action.payload;
    },
    clearFolderSelection: (state) => {
      state.selectedFolders = [];
    },

    // 테스트 케이스 선택 관련
    selectTestCase: (state, action: PayloadAction<{ id: number; index: number; isShiftKey: boolean }>) => {
      const { id, index, isShiftKey } = action.payload;
      
      if (isShiftKey && state.lastSelectedIndex !== null) {
        // Shift+클릭 범위 선택
        const start = Math.min(state.lastSelectedIndex, index);
        const end = Math.max(state.lastSelectedIndex, index);
        
        // 범위 내 모든 테스트 케이스 ID를 가져와야 함 (실제 구현에서는 API 호출 필요)
        // 임시로 현재 선택된 항목들만 처리
        if (!state.selectedTestCases.includes(id)) {
          state.selectedTestCases.push(id);
        }
      } else {
        // 단일 선택
        if (!state.selectedTestCases.includes(id)) {
          state.selectedTestCases.push(id);
        }
      }
      
      state.lastSelectedIndex = index;
    },
    deselectTestCase: (state, action: PayloadAction<number>) => {
      state.selectedTestCases = state.selectedTestCases.filter(id => id !== action.payload);
    },
    selectTestCases: (state, action: PayloadAction<number[]>) => {
      state.selectedTestCases = action.payload;
    },
    clearTestCaseSelection: (state) => {
      state.selectedTestCases = [];
      state.lastSelectedIndex = null;
    },

    // 전체 선택/해제
    selectAllTestCases: (state, action: PayloadAction<number[]>) => {
      state.selectedTestCases = action.payload;
    },
    deselectAllTestCases: (state) => {
      state.selectedTestCases = [];
      state.lastSelectedIndex = null;
    },

    // 선택 상태 관리
    setSelecting: (state, action: PayloadAction<boolean>) => {
      state.isSelecting = action.payload;
    },

    // 전체 선택 해제
    clearAllSelections: (state) => {
      state.selectedFolders = [];
      state.selectedTestCases = [];
      state.lastSelectedIndex = null;
      state.isSelecting = false;
    },
  },
});

export const {
  selectFolder,
  deselectFolder,
  selectFolders,
  clearFolderSelection,
  selectTestCase,
  deselectTestCase,
  selectTestCases,
  clearTestCaseSelection,
  selectAllTestCases,
  deselectAllTestCases,
  setSelecting,
  clearAllSelections,
} = selectionSlice.actions;

export default selectionSlice.reducer; 