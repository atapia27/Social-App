import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import { VideoSchema, EditVideo } from '../../models/schemas';

interface VideoState {
  videos: VideoSchema[];
  loading: boolean;
  error: string | null;
}

const initialState: VideoState = {
  videos: [],
  loading: false,
  error: null,
};

const videoSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    fetchVideosStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchVideosSuccess(state, action: PayloadAction<VideoSchema[]>) {
      state.videos = action.payload;
      state.loading = false;
    },
    fetchVideosFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addVideo(state, action: PayloadAction<VideoSchema>) {
      state.videos.push(action.payload);
    },
    editVideo(state, action: PayloadAction<EditVideo>) {
      const { video_id, title, description } = action.payload;
      const video = state.videos.find(v => v.video_id === video_id);
      if (video) {
        video.title = title;
        video.description = description;
      }
    },
  },
});

export const {
  fetchVideosStart,
  fetchVideosSuccess,
  fetchVideosFailure,
  addVideo,
  editVideo,
} = videoSlice.actions;

export default videoSlice.reducer;


// fetches videos from a specific user
export const fetchVideos = (user_id: string): AppThunk => async (dispatch) => {
  dispatch(fetchVideosStart());
  try {
    const response = await fetch(`/api/videos?user_id=${user_id}`);
    const data: VideoSchema[] = await response.json();
    dispatch(fetchVideosSuccess(data));
  } catch (err: any) {
    dispatch(fetchVideosFailure(err.toString()));
  }
};

export const createVideo = (video: VideoSchema): AppThunk => async (dispatch) => {
  try {
    const response = await fetch('/api/videos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(video),
    });
    const newVideo: VideoSchema = await response.json();
    dispatch(addVideo(newVideo));
  } catch (err: any) {
    console.error(err);
  }
};

export const updateVideo = (editVideoData: EditVideo): AppThunk => async (dispatch) => {
  try {
    await fetch('/api/videos', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editVideoData),
    });
    dispatch(editVideo(editVideoData));
  } catch (err: any) {
    console.error(err);
  }
};
