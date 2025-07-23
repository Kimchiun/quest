import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface TestCase {
  id: number;
  title: string;
  prereq?: string;
  steps: string[];
  expected: string;
  priority: 'High' | 'Medium' | 'Low';
  tags: string[];
  status: 'Active' | 'Archived';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestCaseState {
  list: TestCase[];
  detail: TestCase | null;
  loading: boolean;
  error: string | null;
  searchParams: any;
}

const initialState: TestCaseState = {
  list: [],
  detail: null,
  loading: false,
  error: null,
  searchParams: {},
};

export const fetchTestCases = createAsyncThunk('testcases/fetch', async () => {
  const res = await axios.get('/api/testcases');
  return res.data as TestCase[];
});

export const fetchTestCaseDetail = createAsyncThunk('testcases/detail', async (id: number) => {
  const res = await axios.get(`/api/testcases/${id}`);
  return res.data as TestCase;
});

export const searchTestCases = createAsyncThunk('testcases/search', async (query: any) => {
  const res = await axios.post('/api/testcases/search', query);
  return res.data as TestCase[];
});

const testCaseSlice = createSlice({
  name: 'testcases',
  initialState,
  reducers: {
    setSearchParams(state, action: PayloadAction<any>) {
      state.searchParams = action.payload;
    },
    clearDetail(state) {
      state.detail = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTestCases.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchTestCases.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchTestCases.rejected, (state, action) => { state.loading = false; state.error = action.error.message || '불러오기 실패'; })
      .addCase(fetchTestCaseDetail.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchTestCaseDetail.fulfilled, (state, action) => { state.loading = false; state.detail = action.payload; })
      .addCase(fetchTestCaseDetail.rejected, (state, action) => { state.loading = false; state.error = action.error.message || '상세 불러오기 실패'; })
      .addCase(searchTestCases.pending, state => { state.loading = true; state.error = null; })
      .addCase(searchTestCases.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(searchTestCases.rejected, (state, action) => { state.loading = false; state.error = action.error.message || '검색 실패'; });
  },
});

export const { setSearchParams, clearDetail } = testCaseSlice.actions;
export default testCaseSlice.reducer; 