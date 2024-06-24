import React, { useState } from "react";
import { FiCornerDownRight } from "react-icons/fi";

interface CreateVideoFormProps {
  onCreate: (title: string, description: string, videoUrl: string) => void;
}

const CreateVideoForm: React.FC<CreateVideoFormProps> = ({ onCreate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(title, description, videoUrl);
    setTitle("");
    setDescription("");
    setVideoUrl("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-[55%] mb-8 bg-white rounded-lg shadow-md px-6 py-4 pt-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="videoUrl"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Video URL
          </label>
          <input
            type="url"
            id="videoUrl"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Enter video URL"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter video description"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none"
          required
        />
      </div>
      <div className="flex justify-center border-t border-gray-200 mt-2 pt-2 items-center text-sm">
        <button
          type="submit"
          className=" w-1/5 flex items-center justify-center px-4 text-gray-500 rounded-md hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <FiCornerDownRight className="mr-2" />
          Post
        </button>
      </div>
    </form>
  );
};

export default CreateVideoForm;
