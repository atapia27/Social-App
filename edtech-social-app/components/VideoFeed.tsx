// VideoFeed.tsx
import React from 'react';
import VideoPost from './VideoPost';

const VideoFeed: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8 xl:grid-cols-1">
        <VideoPost
          title="Cafe"
          description="Cafe LoFi"
          videoUrl="https://www.youtube.com/embed/OO2kPK5-qno"
        />
        <VideoPost
          title="BMO"
          description="BMO LoFi"
          videoUrl="https://www.youtube.com/embed/Ah7i5EFVDqA"
        />
        <VideoPost
          title="BMO"
          description="BMO LoFi"
          videoUrl="https://www.youtube.com/embed/Ah7i5EFVDqA"
        />
      </div>
    </div>
  );
};

export default VideoFeed;
