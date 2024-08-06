export interface GetVideosResponse {
  created_at: string
  video_url: string
  user_id: string
  description: string
  title: string
  num_comments: number
  id: string // video id
}

export interface PostVideo {
  user_id: string
  description: string
  video_url: string
  title: string
}

const API_BASE_URL = 'https://social-app-y6hc.onrender.com/api'; // Your FastAPI backend URL

export const fetchUserVideosAPI = async (user_id: string) => {
  const response = await fetch(
    `${API_BASE_URL}/videos/${user_id}`,
  )
  if (response.ok) {
    const data = await response.json()
    return data.videos.map((video: GetVideosResponse) => ({
      ...video,
      id: video.id, // Use video.id instead of user_id
    }))
  } else {
    const error = await response.json()
    throw new Error(error.message)
  }
}

export const addVideoAPI = async (video: PostVideo) => {
  const response = await fetch(
    `${API_BASE_URL}/videos`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(video),
    },
  )
  if (response.ok) {
    const data = await response.json()
    return {
      ...video,
      created_at: data.created_at,
      num_comments: data.num_comments,
      id: data.id,
    }
  } else {
    const error = await response.json()
    throw new Error(error.message)
  }
}