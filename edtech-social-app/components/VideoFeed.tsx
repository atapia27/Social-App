//edtech-social-app\components\VideoFeed.tsx
import React, { useState } from "react"
import VideoPost from "./VideoPost"
import CreateVideoForm from "./CreateVideoForm"

const VideoFeed: React.FC = () => {
  const [videos, setVideos] = useState([
    {
      video_id: "1",
      user_id: "user_me",
      title: "Cafe",
      description: "Cafe LoFi",
      videoUrl: "https://www.youtube.com/embed/OO2kPK5-qno",
    },
    {
      video_id: "2",
      user_id: "user_me",
      title: "BMO",
      description: "BMO LoFi",
      videoUrl: "https://www.youtube.com/embed/Ah7i5EFVDqA",
    },
  ])

  const handleCreateVideo = (
    title: string,
    description: string,
    videoUrl: string,
  ) => {
    const newVideo = {
      video_id: String(videos.length + 1),
      user_id: "user_me",
      title,
      description,
      videoUrl,
    }
    setVideos([newVideo, ...videos])
  }

  return (
    <div className="container mx-auto py-8">
      <CreateVideoForm onCreate={handleCreateVideo} />
      <div className="grid gap-8 xl:grid-cols-1">
        {videos.map((video) => (
          <VideoPost
            key={video.video_id}
            title={video.title}
            description={video.description}
            videoUrl={video.videoUrl}
          />
        ))}
      </div>
    </div>
  )
}

export default VideoFeed
