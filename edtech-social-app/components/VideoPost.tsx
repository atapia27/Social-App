import React from 'react';
import { FiThumbsUp, FiMessageSquare, FiShare } from 'react-icons/fi';

interface VideoPostProps {
  title: string;
  description: string;
  videoUrl: string;
}

const VideoPost: React.FC<VideoPostProps> = ({ title, description, videoUrl }) => {
  return (
    <div className="mx-auto w-[48rem] mb-8 bg-white rounded-lg shadow-md">
      <div className="relative">
        <iframe
          className="w-full rounded-t-lg"
          height="315"
          src={videoUrl}
          title={title}
          allowFullScreen
        ></iframe>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="border-t border-gray-200 mt-2 pt-2 px-14 flex items-center justify-between text-sm">
          <button className="flex items-center text-gray-500">
            <FiThumbsUp className="mr-1" />
            Like
          </button>
          <button className="flex items-center ml-4 text-gray-500">
            <FiMessageSquare className="mr-1" />
            Comment
          </button>
          <button className="flex items-center ml-4 text-gray-500">
            <FiShare className="mr-1" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPost;
