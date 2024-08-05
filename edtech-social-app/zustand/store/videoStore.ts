// edtech-social-app\zustand\stores\videoStore.ts

import { create } from "zustand"
import {
  fetchUserVideosAPI,
  addVideoAPI,
  GetVideosResponse,
  PostVideo,
} from "../../api/video"

interface VideoState {
  videos: GetVideosResponse[]
  loading: boolean
  error: string | null
}

interface VideoActions {
  fetchVideos: (user_id: string) => void
  addVideo: (
    video: Omit<GetVideosResponse, "created_at" | "num_comments" | "id">,
  ) => void
}

const useVideoStore = create<VideoState & VideoActions>()((set) => ({
  videos: [],
  loading: false,
  error: null,
  fetchVideos: async (user_id: string) => {
    // set the loading state to true and clear any existing errors
    set({ loading: true, error: null })
    try {
      const videos = await fetchUserVideosAPI(user_id)
      set({ videos, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },
  addVideo: async (video) => {
    set({ loading: true, error: null })
    try {
      const newVideo = await addVideoAPI(video)
      set((state) => ({ videos: [...state.videos, newVideo], loading: false }))
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },
}))

export default useVideoStore
