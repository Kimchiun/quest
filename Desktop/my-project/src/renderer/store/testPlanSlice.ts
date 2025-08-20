import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TestPlanData {
  title: string;
  projectOverview: string;
  testObjective: string;
  testingApproach: string;
  exceptionHandling: string;
  testScopeLimitations: string;
  excludedAreas: string;
  assumptions: string;
  schedule: Array<{
    phase: string;
    startDate: string;
    endDate: string;
    tasks: string;
    method: string;
  }>;
  responsibleParties: Array<{
    role: string;
    person: string;
  }>;
  riskFactors: Array<{
    name: string;
    impact: string;
    probability: string;
    mitigation: string;
  }>;
  referenceDocuments: Array<{
    name: string;
    url: string;
    filename: string;
  }>;
  issueReports: Array<{
    name: string;
    path: string;
    filename: string;
  }>;
  testEnvironments: Array<{
    category: string;
    details: string;
  }>;
  testStrategies: Array<{
    name: string;
    description: string;
  }>;
}

interface TestPlanState {
  data: TestPlanData | null;
  isEditMode: boolean;
  hasUnsavedChanges: boolean;
}

const initialState: TestPlanState = {
  data: null,
  isEditMode: false,
  hasUnsavedChanges: false
};

const testPlanSlice = createSlice({
  name: 'testPlan',
  initialState,
  reducers: {
    setTestPlanData: (state, action: PayloadAction<TestPlanData>) => {
      state.data = action.payload;
      state.hasUnsavedChanges = false;
    },
    updateTestPlanField: (state, action: PayloadAction<{ field: keyof TestPlanData; value: any }>) => {
      if (state.data) {
        (state.data as any)[action.payload.field] = action.payload.value;
        state.hasUnsavedChanges = true;
      }
    },
    setEditMode: (state, action: PayloadAction<boolean>) => {
      state.isEditMode = action.payload;
      if (!action.payload) {
        state.hasUnsavedChanges = false;
      }
    },
    resetTestPlan: (state) => {
      state.data = null;
      state.isEditMode = false;
      state.hasUnsavedChanges = false;
    },
    markAsSaved: (state) => {
      state.hasUnsavedChanges = false;
    }
  }
});

export const {
  setTestPlanData,
  updateTestPlanField,
  setEditMode,
  resetTestPlan,
  markAsSaved
} = testPlanSlice.actions;

export default testPlanSlice.reducer;
