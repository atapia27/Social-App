import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState, AppThunk } from "../redux/store";
import { createComment } from "../redux/slices/commentSlice";
import { CommentSchema } from "../models/schemas";
import { FiSend } from "react-icons/fi";

interface Props {
  videoId: string; // ID of the video for which the comment is being submitted
}

const CommentForm: React.FC<Props> = ({ videoId }) => {
  const [content, setContent] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return; // Do not submit empty comments

    const newComment: CommentSchema = {
      comment_id: "comment123", // You can replace this with the actual comment ID
      video_id: videoId,
      content: content.trim(),
      user_id: "user123", // You can replace this with the actual user ID
    };

    try {
      // Dispatch an action to create the comment
      await dispatch(createComment(newComment));
      // Clear the input field after submission
      setContent("");
    } catch (error) {
      console.error("Error creating comment:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 mx-4 flex items-center gap-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className=" w-full p-2 border border-gray-300 rounded resize-none"
      />
      <button
        type="submit"
        className="h-16 w-[7.5%] flex items-center justify-center py-1 px-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <FiSend />
      </button>
    </form>
  );
};

export default CommentForm;
