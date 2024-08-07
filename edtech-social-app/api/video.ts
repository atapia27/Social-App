//edtech-social-app\api\video.ts
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

export const fetchUserVideosAPI = async (user_id: string): Promise<GetVideosResponse[]> => {
  console.log(`Fetching videos for user_id: ${user_id}`)
  const response = await fetch(
    `${API_BASE_URL}/videos/${user_id}`,
  )
  if (response.ok) {
    const data = await response.json()
    console.log("Videos fetched successfully:", data)
    return data.videos.map((video: GetVideosResponse) => ({
      ...video,
      id: video.id, // Use video.id instead of user_id
    }))
  } else {
    const error = await response.json()
    console.error("Failed to fetch videos:", error)
    throw new Error(error.message)
  }
}

export const fetchAllVideosAPI = async (): Promise<GetVideosResponse[]> => {
  console.log(`Fetching all videos`)
  const response = await fetch(`${API_BASE_URL}/videos/all`)
  if (response.ok) {
    const data = await response.json()
    console.log("All videos fetched successfully:", data)
    return data.videos.map((video: GetVideosResponse) => ({
      ...video,
      id: video.id, // Use video.id instead of user_id
    }))
  } else {
    const error = await response.json()
    console.error("Failed to fetch all videos:", error)
    throw new Error(error.message)
  }
}

export const addVideoAPI = async (post_info: PostVideo) => {
  console.log(`Adding video: ${JSON.stringify(post_info)}`)
  const response = await fetch(
    `${API_BASE_URL}/videos`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post_info),
    },
  )
  if (response.ok) {
    console.log("Video added successfully")
  } else {
    const error = await response.json()
    console.error("Failed to add video:", error)
    throw new Error(error.detail || "Failed to add video")
  }
}
