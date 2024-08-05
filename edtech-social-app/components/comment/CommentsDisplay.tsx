import React, { useEffect } from "react";
import useCommentStore from "../../zustand/store/commentStore";

interface CommentsDisplayProps {
  video_id: string;
}

const CommentsDisplay: React.FC<CommentsDisplayProps> = () => {
  const { comments, loading, error } = useCommentStore();

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div>Error loading comments: {error}</div>;

  return (
    <div className="comments-display border-t border-gray-200 pt-2 mt-2">
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
