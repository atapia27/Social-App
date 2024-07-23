//edtech-social-app\components\CommentForm.tsx
import { useState } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch, RootState, AppThunk } from "../redux/store"
import { createComment } from "../redux/slices/commentSlice"
import { CommentSchema } from "../schemas/schemas"
import { FiSend } from "react-icons/fi"

interface Props {
  videoId: string // ID of the video for which the comment is being submitted
}

const CommentForm: React.FC<Props> = ({ videoId }) => {
  const [content, setContent] = useState("")
  const dispatch = useDispatch<AppDispatch>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return // Do not submit empty comments

    const newComment: CommentSchema = {
      comment_id: "comment123", // You can replace this with the actual comment ID
      video_id: videoId,
      content: content.trim(),
      user_id: "user123", // You can replace this with the actual user ID
    }

    try {
      // Dispatch an action to create the comment
      await dispatch(createComment(newComment))
      // Clear the input field after submission
      setContent("")
    } catch (error) {
      console.error("Error creating comment:", error)
      // Handle error (e.g., show error message to user)
    }
  }

  return (
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
  )
}

export default CommentForm
