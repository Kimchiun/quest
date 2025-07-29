import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../../utils/axios';

// showToast 임시 선언 (실제 구현은 공통 유틸로 분리 권장)
function showToast(message: string, type: 'error' | 'info' | 'success' = 'error') {
  alert(`[${type}] ${message}`);
}

export interface Release {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}
export interface Suite {
  id: number;
  releaseId: number;
  name: string;
  description?: string;
  executor?: string;
  environment?: string;
  dueDate?: string;
  createdAt: string;
}

export interface ReleaseState {
  releases: Release[];
  suites: Suite[];
  loading: boolean;
  error: string | null;
}

const initialState: ReleaseState = {
  releases: [],
  suites: [],
  loading: false,
  error: null,
};

export const fetchReleases = createAsyncThunk('releases/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/api/releases');
    return res.data as Release[];
  } catch (error: any) {
    showToast(error?.response?.data?.message || error.message || '릴리즈 불러오기 실패', 'error');
    return rejectWithValue(error.message);
  }
});
export const fetchSuites = createAsyncThunk('suites/fetch', async (releaseId: number, { rejectWithValue }) => {
  try {
    const res = await api.get(`/api/releases/${releaseId}/suites`);
    return res.data as Suite[];
  } catch (error: any) {
    showToast(error?.response?.data?.message || error.message || '스위트 불러오기 실패', 'error');
    return rejectWithValue(error.message);
  }
});

export const createRelease = createAsyncThunk('releases/create', async (data: Omit<Release, 'id' | 'createdAt'>, { rejectWithValue }) => {
  try {
    const res = await api.post('/api/releases', data);
    return res.data as Release;
  } catch (error: any) {
    showToast(error?.response?.data?.message || error.message || '릴리즈 생성 실패', 'error');
    return rejectWithValue(error.message);
  }
});
export const updateRelease = createAsyncThunk('releases/update', async ({ id, data }: { id: number; data: Partial<Omit<Release, 'id' | 'createdAt'>> }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/api/releases/${id}`, data);
    return res.data as Release;
  } catch (error: any) {
    showToast(error?.response?.data?.message || error.message || '릴리즈 수정 실패', 'error');
    return rejectWithValue(error.message);
  }
});
export const deleteRelease = createAsyncThunk('releases/delete', async (id: number, { rejectWithValue }) => {
  try {
    await api.delete(`/api/releases/${id}`);
    return id;
  } catch (error: any) {
    showToast(error?.response?.data?.message || error.message || '릴리즈 삭제 실패', 'error');
    return rejectWithValue(error.message);
  }
});

const releaseSlice = createSlice({
  name: 'release',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchReleases.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchReleases.fulfilled, (state, action) => { state.loading = false; state.releases = action.payload; })
      .addCase(fetchReleases.rejected, (state, action) => { state.loading = false; state.error = action.error.message || '릴리즈 불러오기 실패'; })
      .addCase(fetchSuites.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchSuites.fulfilled, (state, action) => { state.loading = false; state.suites = action.payload; })
      .addCase(fetchSuites.rejected, (state, action) => { state.loading = false; state.error = action.error.message || '스위트 불러오기 실패'; })
      // 릴리즈 생성
      .addCase(createRelease.fulfilled, (state, action) => { state.releases.push(action.payload); })
      // 릴리즈 수정
      .addCase(updateRelease.fulfilled, (state, action) => {
        const idx = state.releases.findIndex(r => r.id === action.payload.id);
        if (idx !== -1) state.releases[idx] = action.payload;
      })
      // 릴리즈 삭제
      .addCase(deleteRelease.fulfilled, (state, action) => {
        state.releases = state.releases.filter(r => r.id !== action.payload);
      });
  },
});

export default releaseSlice.reducer; 