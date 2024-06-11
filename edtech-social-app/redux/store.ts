import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import videoReducer from './slices/videoSlice';
import commentReducer from './slices/commentSlice';

export const store = configureStore({
  reducer: {
    videos: videoReducer,
    comments: commentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
