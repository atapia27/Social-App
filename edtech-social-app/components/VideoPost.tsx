//edtech-social-app\components\VideoPost.tsx
import React, { useState } from "react"
import { FiThumbsUp, FiMessageSquare, FiShare } from "react-icons/fi"
import CommentForm from "./CommentForm"

interface VideoPostProps {
  // user_id: string to relate the video to the user
  video_id: string
  description: string
  video_url: string
  title: string
}

const VideoPost: React.FC<VideoPostProps> = ({
  video_id,
  description,
  video_url,
  title,
}) => {
  const [showCommentForm, setShowCommentForm] = useState(false)

  const toggleCommentForm = () => {
    setShowCommentForm(!showCommentForm)
  }

  return (
    <div className="mx-auto mb-8 w-[55%] rounded-lg bg-white shadow-md">
      <div className="relative">
        <iframe
          className="w-full rounded-t-lg"
          height="315"
          src={video_url}
          title={title}
          allowFullScreen
        ></iframe>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
        {showCommentForm && <CommentForm video_id={video_id} />}
        <div className="mt-2 flex items-center justify-between border-t border-gray-200 px-14 pt-2 text-sm">
          <button className="flex items-center text-gray-500 hover:text-gray-700">
            <FiThumbsUp className="mr-1" />
            Like
          </button>
          <button
            className="ml-4 flex items-center text-gray-500 hover:text-gray-700"
            onClick={toggleCommentForm}
          >
            <FiMessageSquare className="mr-1" />
            Comment
          </button>
          <button className="ml-4 flex items-center text-gray-500 hover:text-gray-700">
            <FiShare className="mr-1" />
            Share
          </button>
        </div>
      </div>
    </div>
  )
}

export default VideoPost
