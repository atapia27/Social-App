// edtech-social-app\redux\slices\videoSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../store";

/*
This slice is responsible for managing the state of the videos in the application.
It includes actions for fetching videos, adding a video, and editing a video.

Here is a response from the backend API for Get Videos:
URL Preview:
https://take-home-assessment-423502.uc.r.appspot.com/api/videos/?user_id=john_smith

Query Parameters:
user_id: john_smith

Response:
200 OK
{
	"videos": [
		{
			"created_at": "2024-07-22T17:37:58.522898+00:00",
			"video_url": "https://www.youtube.com/watch?v=9Ov41bcjeIc&ab_channel=NicholasT",
			"user_id": "john_smith",
			"description": "Second Part",
			"title": "Second Video!",
			"num_comments": 0,
			"id": "jt8mwFIauwdRANprIhoQ"
		},
		{
			"created_at": "2024-07-22T17:33:30.217565+00:00",
			"video_url": "https://www.youtube.com/watch?v=9Ov41bcjeIc&ab_channel=NicholasT",
			"user_id": "john_smith",
			"description": "Funny Video",
			"title": "JohnFunnyVideo",
			"num_comments": 0,
			"id": "DMy0OaQOktxZhE0oGbbM"
		},
    ...
  
  ]
}

*/


/*
Requirements:
1. Create a slice named "videoSlice" that manages the state of videos in the application.
2. A selector function named "selectUserVideos" that returns all videos for a specific user_id.
3. A selector function named "selectVideoById" that returns a specific video by its video_id.
4. A selector function named "selectLoading" that returns the loading state.
5. A selector function named "selectError" that returns the error state.
6. An dispatch function named "fetchUserVideos" that fetches all videos for a specific user_ID.
  This data should be fetched using Get Videos stated above.
  The information we are storing for each video is:

    creaated_at: data.created_at,
    video_url: data.video_url,
    user_id: data.user_id,
    description: data.description,
    title: data.title,
    num_comments: data.num_comments,
    video_id: data.id

    created_at: string
    video_url: string
    user_id: string
    description: string
    title: string
    num_comments: number
    video_id: string

Data received
*/ 

interface VideoState {
  videos: SingleVideoAPIResponseFormat[]
  loading: boolean
  error: string | null
}

interface SingleVideoAPIResponseFormat {
  created_at: string,
  video_url: string,
  user_id: string,
  description: string,
  title: string,
  num_comments: number,
  id: string,
}

const initialState: VideoState = {
  videos: [],
  loading: false,
  error: null,
}

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    fetchUserVideosStart(state) {
      state.loading = true
      state.error = null
    },
    fetchUserVideosSuccess(state, action: PayloadAction<SingleVideoAPIResponseFormat[]>) {
      state.videos = action.payload
      state.loading = false
    },
    fetchUserVideosFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
  },
})

export const { fetchUserVideosStart, fetchUserVideosSuccess, fetchUserVideosFailure } = videoSlice.actions

export const fetchUserVideos = (user_id: string): AppThunk => async dispatch => {
  dispatch(fetchUserVideosStart())
  try {
    const response = await fetch(`https://take-home-assessment-423502.uc.r.appspot.com/api/videos/?user_id=${user_id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
    )
    if (response.ok) {
      const data = await response.json()
      const videos = data.videos.map((video: SingleVideoAPIResponseFormat) => ({
        created_at: video.created_at,
        video_url: video.video_url,
        user_id: video.user_id,
        description: video.description,
        title: video.title,
        num_comments: video.num_comments,
        video_id: video.id,
      }))
      dispatch(fetchUserVideosSuccess(videos))
    } else {
      const error = await response.json()
      dispatch(fetchUserVideosFailure(error.message))
    }
  } 
  catch (error) {
    dispatch(fetchUserVideosFailure("An error occurred"))
  }
}



export default videoSlice.reducer