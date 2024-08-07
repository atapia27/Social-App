import React, { useState } from "react"
import { FiCornerDownRight } from "react-icons/fi"
import useAuthStore from "../../zustand/store/authStore"
import useVideoStore from "../../zustand/store/videoStore"
import { PostVideo } from "../../api/video"

const CreateVideoForm: React.FC = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const { user_id } = useAuthStore()
  const { postVideo: addVideo } = useVideoStore()
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (user_id) {
      const post_info: PostVideo = {
        user_id: user_id,
        description: description,
        video_url: videoUrl,
        title: title,
      }
      try {
        console.log("Submitting video:", post_info)
        await addVideo(post_info)
        console.log("Video submitted successfully")
        // Clear the form fields after submission
        setTitle("")
        setDescription("")
        setVideoUrl("")
      } catch (error) {
        console.error("Error submitting video:", error)
      }
    } else {
      console.error("User ID is not available")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mb-8 w-[55%] rounded-lg bg-white px-6 py-4 pt-6 shadow-md"
    >
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="title"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title"
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="videoUrl"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Video URL
          </label>
          <input
            type="url"
            id="videoUrl"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Enter video URL"
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <div className="mb-4">
        <label
          htmlFor="description"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter video description"
          className="w-full resize-none rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div className="mt-2 flex items-center justify-center border-t border-gray-200 pt-2 text-sm">
        <button
          type="submit"
          className="flex w-1/5 items-center justify-center rounded-md px-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <FiCornerDownRight className="mr-2" />
          Post
        </button>
      </div>
    </form>
  )
}

export default CreateVideoForm
