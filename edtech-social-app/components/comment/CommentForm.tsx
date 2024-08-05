import React, { useState } from "react";
import useCommentStore from "../../zustand/store/commentStore";
import { FiSend } from "react-icons/fi";
import CommentsDisplay from "./CommentsDisplay";
import useAuthStore from "../../zustand/store/authStore";

interface Props {
  video_id: string; // ID of the video for which the comment is being submitted
}

const CommentForm: React.FC<Props> = ({ video_id }) => {
  const [content, setContent] = useState("");
  const { postComment } = useCommentStore();
  const { user_id } = useAuthStore((state) => state); // Get user_id from auth store

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return; // Do not submit empty comments

    try {
      // Dispatch an action to create the comment
      await postComment(video_id, content.trim(), user_id!); // Correct user_id usage
      console.log(`Comment posted successfully for video_id: ${video_id}`);
      // Clear the input field after submission
      setContent("");
    } catch (error) {
      console.error("Error creating comment:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="comment-section">
      {video_id && <CommentsDisplay video_id={video_id} />} {/* Include CommentsDisplay above the form */}
      <form onSubmit={handleSubmit} className="mx-4 mt-4 flex items-center gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="w-full resize-none rounded border border-gray-300 p-2"
        />
        <button
          type="submit"
          className="flex h-16 w-[7.5%] items-center justify-center rounded bg-blue-500 px-1 py-1 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <FiSend />
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
