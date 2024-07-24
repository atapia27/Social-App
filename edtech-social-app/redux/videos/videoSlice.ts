// edtech-social-app\redux\slices\videoSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../store";

interface VideoState {
  videos: GetVideosResponse[]
  loading: boolean
  error: string | null
}

interface GetVideosResponse {
  created_at: string
  video_url: string
  user_id: string
  description: string
  title: string
  num_comments: number
  id: string
}

interface PostVideo{
  user_id: string
  description: string
  video_url: string
  title: string
}

const initialState: VideoState = {
  videos: [],
  loading: false,
  error: null,
}

const videoSlice = createSlice({
  name: "videos", // Updated name to match the state key
  initialState,
  reducers: {
    videoStart(state) {
      state.loading = true
      state.error = null
    },
    videoSuccess(state, action: PayloadAction<GetVideosResponse[]>) {
      state.videos = action.payload
      state.loading = false
    },
    videoFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    resetVideos(state) {
      state.videos = []
      state.loading = false
      state.error = null
    },
  },
})

// Reducers: these are used to update the state
export const { videoStart, videoSuccess, videoFailure, resetVideos } = videoSlice.actions

// Selectors: these are used to get the state from the store
export const selectUserVideos = (state: RootState) => state.videos.videos
export const selectVideoById = (state: RootState, id: string) => state.videos.videos.find(video => video.id === id)
export const selectLoading = (state: RootState) => state.videos.loading
export const selectError = (state: RootState) => state.videos.error

// Thunks: this is where we interact with the backend
// This function fetches all videos for a specific user_id
export const fetchUserVideos = (user_id: string): AppThunk => async dispatch => {
  dispatch(videoStart())
  try {
    const response = await fetch(`https://take-home-assessment-423502.uc.r.appspot.com/api/videos/?user_id=${user_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (response.ok) {
      const data = await response.json()
      const videos = data.videos.map((video: GetVideosResponse) => ({
        created_at: video.created_at,
        video_url: video.video_url,
        user_id: video.user_id,
        description: video.description,
        title: video.title,
        num_comments: video.num_comments,
        id: user_id,
      }))
      dispatch(videoSuccess(videos))
    } else {
      const error = await response.json()
      dispatch(videoFailure(error.message))
    }
  } catch (error) {
    dispatch(videoFailure("An error occurred"))
  } 
}

// This function adds a video
// check if PostVideo is the correct type, or if individual fields should be passed
export const addVideo = (video: PostVideo): AppThunk => async dispatch => {
  dispatch(videoStart())
  try {
    const response = await fetch("https://take-home-assessment-423502.uc.r.appspot.com/api/videos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(video),
    })
    if (response.ok) {
      const data = await response.json()
      const newVideo: GetVideosResponse = {
        created_at: data.created_at,
        video_url: data.video_url,
        user_id: data.user_id,
        description: data.description,
        title: data.title,
        num_comments: data.num_comments,
        id: data.id,
      }
      dispatch(videoSuccess([newVideo]))
    } else {
      const error = await response.json()
      dispatch(videoFailure(error.message))
    }
  } catch (error) {
    dispatch(videoFailure("An error occurred"))
  }
}


export default videoSlice.reducer

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


// OLD VERSION
// // edtech-social-app\redux\slices\videoSlice.ts
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { AppThunk } from "../store";
// import { VideoModel, EditVideo, CreateVideo } from "../../schemas/schemas";
// import { RootState } from "../store";

// interface VideoState {
//   videos: VideoModel[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: VideoState = {
//   videos: [],
//   loading: false,
//   error: null,
// };

// const videoSlice = createSlice({
//   name: "videos",
//   initialState,
//   reducers: {
//     fetchVideosStart(state) {
//       state.loading = true;
//       state.error = null;
//     },
//     fetchVideosSuccess(state, action: PayloadAction<VideoModel[]>) {
//       state.videos = action.payload;
//       state.loading = false;
//     },
//     fetchVideosFailure(state, action: PayloadAction<string>) {
//       state.loading = false;
//       state.error = action.payload;
//     },
//     addVideo(state, action: PayloadAction<VideoModel>) {
//       state.videos.push(action.payload);
//     },
//     editVideo(state, action: PayloadAction<EditVideo>) {
//       const { video_id, title, description } = action.payload;
//       const video = state.videos.find((v) => v.video_id === video_id);
//       if (video) {
//         video.title = title;
//         video.description = description;
//       }
//     },
//   },
// });

// export const {
//   fetchVideosStart,
//   fetchVideosSuccess,
//   fetchVideosFailure,
//   addVideo,
//   editVideo,
// } = videoSlice.actions;

// export default videoSlice.reducer;

// // Corrected selectors
// export const selectVideos = (state: RootState) => state.videos.videos;
// export const selectLoading = (state: RootState) => state.videos.loading;
// export const selectError = (state: RootState) => state.videos.error;


// // fetches videos from a specific user
// export const fetchVideos =
//   (user_id: string): AppThunk =>
//   async (dispatch) => {
//     dispatch(fetchVideosStart())
//     try {
//       const response = await fetch(`/api/videos?user_id=${user_id}`)
//       const data: VideoModel[] = await response.json()
//       dispatch(fetchVideosSuccess(data))
//     } catch (err: any) {
//       dispatch(fetchVideosFailure(err.toString()))
//     }
//   }

// export const createVideo =
//   (video: CreateVideo): AppThunk =>
//   async (dispatch) => {
//     try {
//       const response = await fetch("/api/videos", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(video),
//       })
//       const newVideo: VideoModel = await response.json()
//       dispatch(addVideo(newVideo))
//     } catch (err: any) {
//       console.error(err)
//     }
//   }

// export const updateVideo =
//   (editVideoData: EditVideo): AppThunk =>
//   async (dispatch) => {
//     try {
//       await fetch("/api/videos", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(editVideoData),
//       })
//       dispatch(editVideo(editVideoData))
//     } catch (err: any) {
//       console.error(err)
//     }
//   }