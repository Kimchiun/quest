import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Execution } from '@/main/app/domains/executions/models/Execution';
import api from '../../../utils/axios';

export interface ExecutionState {
    executions: Execution[];
    loading: boolean;
    error: string | null;
    offlineQueue: Omit<Execution, 'id' | 'createdAt' | 'updatedAt'>[];
}

const initialState: ExecutionState = {
    executions: [],
    loading: false,
    error: null,
    offlineQueue: [],
};

export const fetchExecutions = createAsyncThunk(
    'executions/fetch',
    async (testcaseId: number) => {
        const res = await api.get(`/api/executions/testcase/${testcaseId}`);
        return res.data as Execution[];
    }
);

export const addExecution = createAsyncThunk(
    'executions/add',
    async (data: Omit<Execution, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
        try {
            const res = await api.post('/api/executions', data);
            return res.data as Execution;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

export const updateExecution = createAsyncThunk(
    'executions/update',
    async ({ id, update }: { id: number; update: Partial<Omit<Execution, 'id' | 'createdAt'>> }, { rejectWithValue }) => {
        try {
            const res = await api.put(`/api/executions/${id}`, update);
            return res.data as Execution;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

export const deleteExecution = createAsyncThunk(
    'executions/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`/api/executions/${id}`);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

export const syncOfflineExecutions = createAsyncThunk(
    'executions/syncOffline',
    async (executions: Omit<Execution, 'id' | 'createdAt' | 'updatedAt'>[], { rejectWithValue }) => {
        try {
            const results: Execution[] = [];
            for (const exec of executions) {
                const res = await api.post('/api/executions', exec);
                results.push(res.data as Execution);
            }
            return results;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

const executionSlice = createSlice({
    name: 'executions',
    initialState,
    reducers: {
        enqueueOfflineExecution(state, action: PayloadAction<Omit<Execution, 'id' | 'createdAt' | 'updatedAt'>>) {
            state.offlineQueue.push(action.payload);
        },
        clearOfflineQueue(state) {
            state.offlineQueue = [];
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchExecutions.pending, state => { state.loading = true; state.error = null; })
            .addCase(fetchExecutions.fulfilled, (state, action) => {
                state.loading = false;
                state.executions = action.payload;
            })
            .addCase(fetchExecutions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null;
            })
            .addCase(addExecution.fulfilled, (state, action) => {
                state.executions.push(action.payload);
            })
            .addCase(addExecution.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(updateExecution.fulfilled, (state, action) => {
                const idx = state.executions.findIndex(e => e.id === action.payload.id);
                if (idx !== -1) state.executions[idx] = action.payload;
            })
            .addCase(updateExecution.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(deleteExecution.fulfilled, (state, action) => {
                state.executions = state.executions.filter(e => e.id !== action.payload);
            })
            .addCase(deleteExecution.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(syncOfflineExecutions.fulfilled, (state, action) => {
                state.executions.push(...action.payload);
                state.offlineQueue = [];
            })
            .addCase(syncOfflineExecutions.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    }
});

export const { enqueueOfflineExecution, clearOfflineQueue } = executionSlice.actions;
export default executionSlice.reducer; 