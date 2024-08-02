//edtech-social-app\components\VideoFeed.tsx
import VideoPost from "./VideoPost"
import { useSelector, useDispatch } from 'react-redux';
import { selectError, selectLoading, selectUserVideos, fetchUserVideos, resetVideos  } from '../redux/videos/videoSlice';
import {selectAuthUsername} from '../redux/auth/authSlice';
import { AppDispatch } from '../redux/store';
import { useEffect } from "react";


const VideoFeed: React.FC = () => {
  const videos = useSelector(selectUserVideos)
  const loading = useSelector(selectLoading)
  const error = useSelector(selectError)
  const username = useSelector(selectAuthUsername) || '';
  const dispatch = useDispatch<AppDispatch>()


  // Fetch videos for user
  useEffect(() => {

    // clear the videos state
    dispatch(resetVideos())

    // Fetch videos for user
    dispatch(fetchUserVideos(username));
  }, [dispatch, username])

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8 xl:grid-cols-1">
        {videos.map((video) => (
          <VideoPost
            key={video.id}
            video_id={video.id}
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