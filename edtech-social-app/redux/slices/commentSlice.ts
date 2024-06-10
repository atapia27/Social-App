/*
Create a slice for comments. The slice should have the following properties, in alignment with prisma schema:
model Comment {
  id      String @id @default(cuid())
  content String
  video   Video  @relation(fields: [videoId], references: [id])
  videoId String
}
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface Comment {
  id: string;
  content: string;
  videoId: string;
}

interface CommentState {
  comments: Comment[];
}

const initialState: CommentState = {
  comments: [],
};

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    addComment: (state, action: PayloadAction<Comment>) => {
      state.comments.push(action.payload);
    },
  },
});

export const { addComment } = commentSlice.actions;
export default commentSlice.reducer;

export const selectComments = (state: RootState) => state.comments.comments;
