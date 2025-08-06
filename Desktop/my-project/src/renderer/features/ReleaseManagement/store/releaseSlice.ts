import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Release, ReleaseTestCase, ReleaseIssue, ReleaseChangeLog, ReleaseRetrospective, ReleaseStats } from '../types';

interface ReleaseState {
  releases: Release[];
  selectedRelease: Release | null;
  releaseTestCases: ReleaseTestCase[];
  releaseIssues: ReleaseIssue[];
  releaseChangeLogs: ReleaseChangeLog[];
  releaseRetrospectives: ReleaseRetrospective[];
  releaseStats: ReleaseStats | null;
  loading: boolean;
  error: string | null;
  
  // 필터링 및 검색
  searchQuery: string;
  statusFilter: string;
  assigneeFilter: string;
}

const initialState: ReleaseState = {
  releases: [],
  selectedRelease: null,
  releaseTestCases: [],
  releaseIssues: [],
  releaseChangeLogs: [],
  releaseRetrospectives: [],
  releaseStats: null,
  loading: false,
  error: null,
  searchQuery: '',
  statusFilter: 'ALL',
  assigneeFilter: 'ALL',
};

const releaseSlice = createSlice({
  name: 'releases',
  initialState,
  reducers: {
    // 로딩 상태 관리
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    // 릴리즈 목록 관리
    setReleases: (state, action: PayloadAction<Release[]>) => {
      state.releases = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    addRelease: (state, action: PayloadAction<Release>) => {
      state.releases.unshift(action.payload);
    },
    
    updateRelease: (state, action: PayloadAction<Release>) => {
      const index = state.releases.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.releases[index] = action.payload;
      }
      if (state.selectedRelease?.id === action.payload.id) {
        state.selectedRelease = action.payload;
      }
    },
    
    removeRelease: (state, action: PayloadAction<string>) => {
      state.releases = state.releases.filter(r => r.id !== action.payload);
      if (state.selectedRelease?.id === action.payload) {
        state.selectedRelease = null;
      }
    },
    
    // 선택된 릴리즈 관리
    setSelectedRelease: (state, action: PayloadAction<Release | null>) => {
      state.selectedRelease = action.payload;
    },
    
    // 릴리즈 세부 데이터 관리
    setReleaseTestCases: (state, action: PayloadAction<ReleaseTestCase[]>) => {
      state.releaseTestCases = action.payload;
    },
    
    setReleaseIssues: (state, action: PayloadAction<ReleaseIssue[]>) => {
      state.releaseIssues = action.payload;
    },
    
    setReleaseChangeLogs: (state, action: PayloadAction<ReleaseChangeLog[]>) => {
      state.releaseChangeLogs = action.payload;
    },
    
    setReleaseRetrospectives: (state, action: PayloadAction<ReleaseRetrospective[]>) => {
      state.releaseRetrospectives = action.payload;
    },
    
    // 통계 관리
    setReleaseStats: (state, action: PayloadAction<ReleaseStats>) => {
      state.releaseStats = action.payload;
    },
    
    // 필터링 및 검색
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
    },
    
    setAssigneeFilter: (state, action: PayloadAction<string>) => {
      state.assigneeFilter = action.payload;
    },
    
    // 필터 초기화
    clearFilters: (state) => {
      state.searchQuery = '';
      state.statusFilter = 'ALL';
      state.assigneeFilter = 'ALL';
    },
    
    // 전체 상태 초기화
    resetReleaseState: (state) => {
      return initialState;
    },
  },
});

export const {
  setLoading,
  setError,
  setReleases,
  addRelease,
  updateRelease,
  removeRelease,
  setSelectedRelease,
  setReleaseTestCases,
  setReleaseIssues,
  setReleaseChangeLogs,
  setReleaseRetrospectives,
  setReleaseStats,
  setSearchQuery,
  setStatusFilter,
  setAssigneeFilter,
  clearFilters,
  resetReleaseState,
} = releaseSlice.actions;

export default releaseSlice.reducer;