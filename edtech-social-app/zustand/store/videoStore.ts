//edtech-social-app\zustand\store\videoStore.ts
import { create } from "zustand"
import {
  fetchUserVideosAPI,
  fetchAllVideosAPI,
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
  fetchAllVideos: () => void
  postVideo: (post_info: PostVideo) => void
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
      console.error(`Failed to fetch videos: ${error.message}`)
      set({ error: error.message, loading: false })
    }
  },
  fetchAllVideos: async () => {
    // set the loading state to true and clear any existing errors
    set({ loading: true, error: null })
    try {
      const videos = await fetchAllVideosAPI()
      console.log(`Fetched ${videos.length} videos from all users`)
      set({ videos, loading: false })
    } catch (error: any) {
      console.error(`Failed to fetch all videos: ${error.message}`)
      set({ error: error.message, loading: false })
    }
  },
  postVideo: async (post_info: PostVideo) => {
    console.log(`postVideo called with post_info: ${JSON.stringify(post_info)}`)
    set({ loading: true, error: null })
    try {
      await addVideoAPI(post_info)
      console.log("Video posted successfully")
      // Fetch updated videos list after posting a new video
      const updatedVideos = await fetchAllVideosAPI()
      console.log(`Updated videos fetched: ${JSON.stringify(updatedVideos)}`)
      set({ videos: updatedVideos, loading: false, error: null })
    } catch (error: any) {
      console.error(`Failed to post video: ${error.message}`)
      set({ error: error.message, loading: false })
    }
  },
}))

export default useVideoStore
