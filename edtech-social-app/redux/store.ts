import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import videoReducer from "./slices/videoSlice";
import commentReducer from "./slices/commentSlice";
import authReducer from "./slices/authSlice"; // Import the authReducer

export const store = configureStore({
  reducer: {
    videos: videoReducer,
    comments: commentReducer,
    auth: authReducer, // Add authReducer to the store
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = Promise<void>> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
