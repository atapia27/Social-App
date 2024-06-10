import { FC } from 'react';
import VideoPost from './VideoPost';

const VideoFeed: FC = () => {
  return (
    <div className="space-y-6">
      {/* Placeholder Video Posts */}
      <VideoPost />
      <VideoPost />
      <VideoPost />
    </div>
  );
};

export default VideoFeed;
