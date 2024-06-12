import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import { CommentSchema } from '../../models/schemas';

interface CommentState {
  comments: CommentSchema[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    fetchCommentsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCommentsSuccess(state, action: PayloadAction<CommentSchema[]>) {
      state.comments = action.payload;
      state.loading = false;
    },
    fetchCommentsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addComment(state, action: PayloadAction<CommentSchema>) {
      state.comments.push(action.payload);
    },
  },
});

export const {
  fetchCommentsStart,
  fetchCommentsSuccess,
  fetchCommentsFailure,
  addComment,
} = commentSlice.actions;

export default commentSlice.reducer;

export const fetchComments = (video_id: string): AppThunk => async (dispatch) => {
  dispatch(fetchCommentsStart());
  try {
    const response = await fetch(`/api/videos/comments?video_id=${video_id}`);
    const data: CommentSchema[] = await response.json();
    dispatch(fetchCommentsSuccess(data));
  } catch (err: any) {
    dispatch(fetchCommentsFailure(err.toString()));
  }
};

export const createComment = (comment: CommentSchema): AppThunk => async (dispatch) => {
  try {
    const response = await fetch('/api/videos/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comment),
    });
    const newComment: CommentSchema = await response.json();
    dispatch(addComment(newComment));
  } catch (err: any) {
    console.error(err);
  }
};
