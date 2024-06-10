import { FC } from 'react';
import { FiThumbsUp, FiMessageSquare, FiShare } from 'react-icons/fi';

const VideoPost: FC = () => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="mb-2">
        <video controls className="w-full h-auto rounded">
          <source src="path/to/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Video Title</h3>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-1 text-blue-600">
            <FiThumbsUp />
            <span>Like</span>
          </button>
          <button className="flex items-center space-x-1 text-blue-600">
            <FiMessageSquare />
            <span>Comment</span>
          </button>
          <button className="flex items-center space-x-1 text-blue-600">
            <FiShare />
            <span>Share</span>
          </button>
        </div>
      </div>
      <div>
        <p>Comments will be displayed here...</p>
      </div>
    </div>
  );
};

export default VideoPost;
