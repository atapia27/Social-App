//edtech-social-app\components\VideoFeed.tsx
import VideoPost from "./VideoPost"
import { useEffect } from "react";
import {useVideoStore} from  "../../zustand/stores/videoStore";

const VideoFeed: React.FC = () => {
  const { loading, videos, error, fetchVideos } = useVideoStore((state) => ({
    loading: state.loading,
    videos: state.videos,
    error: state.error,
    fetchVideos: state.fetchVideos,
  }));

  const username = '1'; // Adjust based on how you get the username

  // Fetch videos for user
  useEffect(() => {
    fetchVideos(username);
  }, [fetchVideos, username]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

export default VideoFeed