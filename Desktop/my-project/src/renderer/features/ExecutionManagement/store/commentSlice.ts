import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../../utils/axios';

export interface Comment {
  id: number;
  objectType: 'testcase' | 'execution' | 'defect';
  objectId: number;
  author: string;
  content: string;
  mentions: string[];
  createdAt: string;
  updatedAt: string;
}

interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async ({ objectType, objectId }: { objectType: string; objectId: number }) => {
    const res = await api.get<Comment[]>(`/api/comments/${objectType}/${objectId}`);
    return res.data;
  }
);

export const addComment = createAsyncThunk(
  'comments/addComment',
  async (data: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const res = await api.post<Comment>('/api/comments', data);
    return res.data;
  }
);

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ id, content, mentions }: { id: number; content: string; mentions: string[] }) => {
    const res = await api.put<Comment>(`/api/comments/${id}`, { content, mentions });
    return res.data;
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (id: number) => {
    await api.delete(`/api/comments/${id}`);
    return id;
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearComments(state) {
      state.comments = [];
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchComments.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action: PayloadAction<Comment[]>) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '댓글 불러오기 실패';
      })
      .addCase(addComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        state.comments.push(action.payload);
      })
      .addCase(updateComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        const idx = state.comments.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) state.comments[idx] = action.payload;
      })
      .addCase(deleteComment.fulfilled, (state, action: PayloadAction<number>) => {
        state.comments = state.comments.filter(c => c.id !== action.payload);
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer; 