import { configureStore } from '@reduxjs/toolkit';
import videoReducer from './slices/videoSlice';
import commentsReducer from './slices/commentSlice';

export const store = configureStore({
  reducer: {
    videos: videoReducer,
    comments: commentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
