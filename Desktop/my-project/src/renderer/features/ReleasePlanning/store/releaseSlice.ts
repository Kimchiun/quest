import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

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

export const fetchReleases = createAsyncThunk('releases/fetch', async () => {
  const res = await axios.get('/api/releases');
  return res.data as Release[];
});
export const fetchSuites = createAsyncThunk('suites/fetch', async (releaseId: number) => {
  const res = await axios.get(`/api/releases/${releaseId}/suites`);
  return res.data as Suite[];
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
      .addCase(fetchSuites.rejected, (state, action) => { state.loading = false; state.error = action.error.message || '스위트 불러오기 실패'; });
  },
});

export default releaseSlice.reducer; 