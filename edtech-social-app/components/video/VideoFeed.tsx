// edtech-social-app/components/video/VideoFeed.tsx

import VideoPost from "./VideoPost"
import { useEffect } from "react"
import useVideoStore from "../../zustand/store/videoStore"
import useAuthStore from "../../zustand/store/authStore"

const VideoFeed: React.FC = () => {
  const { loading, videos, error, fetchVideos } = useVideoStore((state) => ({
    loading: state.loading,
    videos: state.videos,
    error: state.error,
    fetchVideos: state.fetchVideos,
  }))
  // const { user_id } = useAuthStore()
  const user_id = "1"
  
  useEffect(() => {
    if (user_id) {
      fetchVideos(user_id)
    }
  }, [fetchVideos, user_id])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8 xl:grid-cols-1">
        {videos.map((video) => {
          if (
            video.title.length > 0 &&
            video.description.length > 0 &&
            video.video_url.length > 0
          ) {
            return (
              <VideoPost
                key={video.id}
                video_id={video.id}
                title={video.title}
                description={video.description}
                video_url={video.video_url}
              />
            )
          }
          return null
        })}
      </div>
    </div>
  )
}

export default VideoFeed