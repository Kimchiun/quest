import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TestCase {
  id: number;
  title: string;
  description?: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Archived';
  executionStatus: 'Untested' | 'Pass' | 'Fail' | 'Blocked' | 'Defect';
  createdBy: string;
  createdAt: string;
}

export interface Defect {
  id: number;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdBy: string;
  createdAt: string;
  description?: string;
}

export interface FilterState {
  executionStatus: string[];
  priority: string[];
  severity: string[];
  keyword: string;
  showOnlyDefects: boolean;
}

interface DashboardLayoutState {
  leftPanel: {
    isCollapsed: boolean;
    width: number;
  };
  rightPanel: {
    isCollapsed: boolean;
    width: number;
  };
  centerPanel: {
    isFullWidth: boolean;
  };
  activeTab: string;
  selectedReleaseId: string | null;
  selectedTestCaseId: number | null;
  selectedDefectId: number | null;
  filters: FilterState;
  releaseData: {
    testCases: TestCase[];
    defects: Defect[];
    loading: boolean;
    error: string | null;
  };
}

const initialState: DashboardLayoutState = {
  leftPanel: { isCollapsed: false, width: 280 },
  rightPanel: { isCollapsed: false, width: 320 },
  centerPanel: { isFullWidth: false },
  activeTab: 'overview',
  selectedReleaseId: null,
  selectedTestCaseId: null,
  selectedDefectId: null,
  filters: {
    executionStatus: [],
    priority: [],
    severity: [],
    keyword: '',
    showOnlyDefects: false,
  },
  releaseData: {
    testCases: [],
    defects: [],
    loading: false,
    error: null,
  },
};

const dashboardLayoutSlice = createSlice({
  name: 'dashboardLayout',
  initialState,
  reducers: {
    toggleLeftPanel(state) {
      state.leftPanel.isCollapsed = !state.leftPanel.isCollapsed;
    },
    toggleRightPanel(state) {
      state.rightPanel.isCollapsed = !state.rightPanel.isCollapsed;
    },
    setSelectedReleaseId(state, action: PayloadAction<string>) {
      state.selectedReleaseId = action.payload;
      state.selectedTestCaseId = null;
      state.selectedDefectId = null;
    },
    setSelectedTestCaseId(state, action: PayloadAction<number | null>) {
      state.selectedTestCaseId = action.payload;
    },
    setSelectedDefectId(state, action: PayloadAction<number | null>) {
      state.selectedDefectId = action.payload;
    },
    setFilters(state, action: PayloadAction<Partial<FilterState>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters(state) {
      state.filters = initialState.filters;
    },
    setReleaseData(state, action: PayloadAction<{ testCases: TestCase[]; defects: Defect[] }>) {
      state.releaseData.testCases = action.payload.testCases;
      state.releaseData.defects = action.payload.defects;
    },
    setReleaseDataLoading(state, action: PayloadAction<boolean>) {
      state.releaseData.loading = action.payload;
    },
    setReleaseDataError(state, action: PayloadAction<string | null>) {
      state.releaseData.error = action.payload;
    },
  },
});

export const { 
  toggleLeftPanel, 
  toggleRightPanel, 
  setSelectedReleaseId,
  setSelectedTestCaseId,
  setSelectedDefectId,
  setFilters,
  clearFilters,
  setReleaseData,
  setReleaseDataLoading,
  setReleaseDataError,
} = dashboardLayoutSlice.actions;

export default dashboardLayoutSlice.reducer; 