//edtech-social-app\components\VideoFeed.tsx
import VideoPost from "./VideoPost"
import { useSelector, useDispatch } from 'react-redux';
import { selectError, selectLoading, selectVideos, fetchVideos } from '../redux/slices/videoSlice';
import { AppDispatch } from '../redux/store';
import { useEffect } from "react";


const VideoFeed: React.FC = () => {
  var videos = useSelector(selectVideos)
  const loading = useSelector(selectLoading)
  const error = useSelector(selectError)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchVideos("john_smith"));
  }, [dispatch])

  if (loading) return <div>Loading...</div>;
  //if (error) return <div>Error: {error}</div>;

  // set videos to constants to test if it is working
  if (videos.length === 0) {
  videos = [
    {
      video_id: "1",
      user_id: "1",
      title: "Video 1",
      description: "Description 1",
      video_url: "https://www.youtube.com/embed/9bZkp7q19f0",
    },
    {
      video_id: "2",
      user_id: "1",
      title: "Video 2",
      description: "Description 2",
      video_url: "https://www.youtube.com/embed/9bZkp7q19f0",
    },
    {
      video_id: "3",
      user_id: "1",
      title: "Video 3",
      description: "Description 3",
      video_url: "https://www.youtube.com/embed/9bZkp7q19f0",
    },
  ]
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8 xl:grid-cols-1">
        {videos.map((video) => (
          <VideoPost
            key={video.video_id}
            video_id={video.video_id}
            title={video.title}
            description={video.description}
            video_url={video.video_url}
          />
        ))}
      </div>
    </div>
  )
}

export default VideoFeed
