import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../../utils/axios';

// showToast 임시 선언 (실제 구현은 공통 유틸로 분리 권장)
function showToast(message: string, type: 'error' | 'info' | 'success' = 'error') {
  alert(`[${type}] ${message}`);
}

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

export interface AdvancedSearchFilter {
  folders?: string[];
  tags?: string[];
  status?: ('Active' | 'Archived')[];
  createdBy?: string[];
  priority?: ('High' | 'Medium' | 'Low')[];
  dateRange?: {
    from: string;
    to: string;
  };
  keyword?: string;
}

export interface SearchPreset {
  id: string;
  name: string;
  filters: AdvancedSearchFilter;
  createdBy: string;
  createdAt: string;
}

export interface SearchResult {
  testCases: TestCase[];
  total: number;
  highlights: Record<string, string[]>;
}

interface TestCaseState {
  list: TestCase[];
  detail: TestCase | null;
  loading: boolean;
  error: string | null;
  searchParams: any;
  advancedSearch: {
    filters: AdvancedSearchFilter;
    results: SearchResult | null;
    loading: boolean;
    error: string | null;
  };
  presets: SearchPreset[];
}

const initialState: TestCaseState = {
  list: [],
  detail: null,
  loading: false,
  error: null,
  searchParams: {},
  advancedSearch: {
    filters: {},
    results: null,
    loading: false,
    error: null,
  },
  presets: [],
};

export const fetchTestCases = createAsyncThunk('testcases/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/api/testcases');
    return res.data as TestCase[];
  } catch (error: any) {
    showToast(error?.response?.data?.message || error.message || '테스트케이스 불러오기 실패', 'error');
    return rejectWithValue(error.message);
  }
});

export const fetchTestCaseDetail = createAsyncThunk('testcases/fetchDetail', async (id: number, { rejectWithValue }) => {
  try {
    const res = await api.get(`/api/testcases/${id}`);
    return res.data as TestCase;
  } catch (error: any) {
    showToast(error?.response?.data?.message || error.message || '상세 불러오기 실패', 'error');
    return rejectWithValue(error.message);
  }
});

export const searchTestCases = createAsyncThunk('testcases/search', async (query: any, { rejectWithValue }) => {
  try {
    const res = await api.post('/api/testcases/search', query);
    return res.data as TestCase[];
  } catch (error: any) {
    showToast(error?.response?.data?.message || error.message || '검색 실패', 'error');
    return rejectWithValue(error.message);
  }
});

// 고급 검색
export const advancedSearchTestCases = createAsyncThunk(
  'testcases/advancedSearch',
  async ({ filters, page = 0, size = 20 }: { filters: AdvancedSearchFilter; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/testcases/search/advanced', { filters, page, size });
      return res.data as SearchResult;
    } catch (error: any) {
      showToast(error?.response?.data?.message || error.message || '고급 검색 실패', 'error');
      return rejectWithValue(error.message);
    }
  }
);

// 검색 프리셋 저장
export const saveSearchPreset = createAsyncThunk(
  'testcases/savePreset',
  async (preset: Omit<SearchPreset, 'id' | 'createdAt'>, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/testcases/search/presets', preset);
      return res.data as SearchPreset;
    } catch (error: any) {
      showToast(error?.response?.data?.message || error.message || '프리셋 저장 실패', 'error');
      return rejectWithValue(error.message);
    }
  }
);

// 검색 프리셋 목록 조회
export const fetchSearchPresets = createAsyncThunk(
  'testcases/fetchPresets',
  async (createdBy?: string, { rejectWithValue }) => {
    try {
      const params = createdBy ? { createdBy } : {};
      const res = await api.get('/api/testcases/search/presets', { params });
      return res.data as SearchPreset[];
    } catch (error: any) {
      showToast(error?.response?.data?.message || error.message || '프리셋 목록 불러오기 실패', 'error');
      return rejectWithValue(error.message);
    }
  }
);

// 검색 프리셋 삭제
export const deleteSearchPreset = createAsyncThunk(
  'testcases/deletePreset',
  async (presetId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/testcases/search/presets/${presetId}`);
      return presetId;
    } catch (error: any) {
      showToast(error?.response?.data?.message || error.message || '프리셋 삭제 실패', 'error');
      return rejectWithValue(error.message);
    }
  }
);

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
    setAdvancedSearchFilters(state, action: PayloadAction<AdvancedSearchFilter>) {
      state.advancedSearch.filters = action.payload;
    },
    clearAdvancedSearchResults(state) {
      state.advancedSearch.results = null;
      state.advancedSearch.error = null;
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
      .addCase(searchTestCases.rejected, (state, action) => { state.loading = false; state.error = action.error.message || '검색 실패'; })
      // 고급 검색
      .addCase(advancedSearchTestCases.pending, state => { 
        state.advancedSearch.loading = true; 
        state.advancedSearch.error = null; 
      })
      .addCase(advancedSearchTestCases.fulfilled, (state, action) => { 
        state.advancedSearch.loading = false; 
        state.advancedSearch.results = action.payload; 
      })
      .addCase(advancedSearchTestCases.rejected, (state, action) => { 
        state.advancedSearch.loading = false; 
        state.advancedSearch.error = action.error.message || '고급 검색 실패'; 
      })
      // 프리셋 저장
      .addCase(saveSearchPreset.fulfilled, (state, action) => {
        state.presets.unshift(action.payload);
      })
      // 프리셋 목록 조회
      .addCase(fetchSearchPresets.fulfilled, (state, action) => {
        state.presets = action.payload;
      })
      // 프리셋 삭제
      .addCase(deleteSearchPreset.fulfilled, (state, action) => {
        state.presets = state.presets.filter(preset => preset.id !== action.payload);
      });
  },
});

export const { setSearchParams, clearDetail, setAdvancedSearchFilters, clearAdvancedSearchResults } = testCaseSlice.actions;
export default testCaseSlice.reducer; 