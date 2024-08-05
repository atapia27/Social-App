import React, { useEffect } from "react";
import useCommentStore from "../../zustand/store/commentStore";

interface CommentsDisplayProps {
  video_id: string;
}

const CommentsDisplay: React.FC<CommentsDisplayProps> = ({ video_id }) => {
  const { comments, loading, error, fetchComments } = useCommentStore();

  useEffect(() => {
    if (video_id) {
      console.log(`Fetching comments for video_id: ${video_id}`);
    }
  }, [video_id, fetchComments]);

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div>Error loading comments: {error}</div>;

  return (
    <div className="comments-display">
      {comments.map((comment) => (
        <div key={comment.id} className="comment mb-4">
          <p className="text-sm">{comment.content}</p>
          <small className="text-gray-500">
            By {comment.user_id} at {new Date(comment.created_at).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
};

export default CommentsDisplay;
