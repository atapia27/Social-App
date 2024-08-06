import React, { useState } from "react"
import ReactPlayer from "react-player"
import { FiThumbsUp, FiMessageSquare, FiShare } from "react-icons/fi"
import CommentForm from "../comment/CommentForm"
import useCommentStore from "../../zustand/store/commentStore"

interface VideoPostProps {
  video_id: string
  description: string
  video_url: string
  title: string
  num_comments: number
  user_id: string // New prop for user ID
}

const VideoPost: React.FC<VideoPostProps> = ({
  video_id,
  description,
  video_url,
  title,
  num_comments,
  user_id, // Destructure user_id
}) => {
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [valid, setValid] = useState(true)
  const { fetchComments } = useCommentStore()

  const toggleCommentForm = () => {
    setShowCommentForm((prev) => !prev)
    if (!showCommentForm) {
      console.log(`Fetching comments for video_id: ${video_id}`)
      fetchComments(video_id)
    }
  }

  // When URL is invalid, VideoPost component will not render
  const handleError = () => {
    setLoading(false)
    setValid(false)
  }

  // When video is ready, loading state will be set to false
  const handleReady = () => {
    setLoading(false)
  }

  if (!valid) return null

  return (
    <div className="mx-auto mb-8 w-[55%] rounded-lg bg-white shadow-md">
      <div className="p-4">
        <h3 className="text-md font-medium text-gray-700">{user_id}</h3> {/* Display user ID */}
      </div>
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            Loading...
          </div>
        )}
        <ReactPlayer
          url={video_url}
          className="w-full rounded-t-lg"
          width="100%"
          height="315px"
          controls
          onReady={handleReady}
          onError={handleError}
        />
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
            Comments ({num_comments})
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
