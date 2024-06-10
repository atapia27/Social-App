import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  comments: string[];
}

interface VideoState {
  videos: Video[];
}

const initialState: VideoState = {
  videos: [],
};

const videoSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    addVideo: (state, action: PayloadAction<Video>) => {
      state.videos.push(action.payload);
    },
    addComment: (state, action: PayloadAction<{ videoId: string; comment: string }>) => {
      const video = state.videos.find(video => video.id === action.payload.videoId);
      if (video) {
        video.comments.push(action.payload.comment);
      }
    },
  },
});

export const { addVideo, addComment } = videoSlice.actions;
export default videoSlice.reducer;

export const selectVideos = (state: RootState) => state.videos.videos;