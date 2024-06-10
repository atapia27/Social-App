import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { addVideo } from '../redux/slices/videoSlice';
import Link from 'next/link';
import { Video } from '../models/models';

const VideoList = () => {
  const dispatch = useDispatch();
  const videos = useSelector((state: RootState) => state.videos.videos);

  useEffect(() => {
    const fetchVideos = async () => {
      const response = await fetch('/api/videos');
      const data = await response.json();
      data.forEach((video: Video) => dispatch(addVideo(video)));
    };
    fetchVideos();
  }, [dispatch]);

  return (
    <div>
      <h2 className="text-2xl mb-4">Videos</h2>
      <ul>
        {videos.map(video => (
          <li key={video.id}>
            <Link href={`/videos/${video.id}`} className="text-blue-600">
              {video.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoList;
