import React, { useEffect } from "react"
import useCommentStore from "../../zustand/store/commentStore"

interface CommentsDisplayProps {
  video_id: string
}

const CommentsDisplay: React.FC<CommentsDisplayProps> = ({ video_id }) => {
  const { comments, loading, error, fetchComments } = useCommentStore()

  useEffect(() => {
    fetchComments(video_id)
  }, [fetchComments, video_id])

  if (loading) return <div>Loading comments...</div>
  if (error) return <div>Error loading comments: {error}</div>

  return (
    <div className="comments-display mt-2 border-t border-gray-200 pt-2">
      {comments.map((comment) => (
        <div key={comment.id} className="comment mb-4">
          <strong className="block text-sm text-gray-700">{comment.user_id}</strong> {/* User ID */}
          <p className="text-sm">{comment.content}</p> {/* Comment Content */}
          <small className="text-gray-500">
            {new Date(comment.created_at).toLocaleString()} {/* Timestamp */}
          </small>
        </div>
      ))}
    </div>
  )
}

export default CommentsDisplay
