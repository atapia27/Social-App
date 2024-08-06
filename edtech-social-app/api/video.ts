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

export interface Comment {
  id: string
  created_at: string
  content: string
  user_id: string
  video_id: string
}

export interface CommentsResponse {
  comments: Comment[]
}

export const fetchCommentsAPI = async (
  video_id: string,
): Promise<CommentsResponse> => {
  console.log(`Fetching comments for video_id: ${video_id}`);
  const response = await fetch(`${API_BASE_URL}/videos/comments/${video_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data = await response.json();
    console.log(`Comments fetched successfully: ${JSON.stringify(data)}`);
    return data;
  } else {
    const errorData = await response.json();
    console.error(`Failed to fetch comments: ${JSON.stringify(errorData)}`);
    throw new Error(errorData.detail || "Failed to fetch comments");
  }
};

export const postCommentAPI = async (video_id: string, content: string, user_id: string): Promise<void> => {
  console.log(`Posting comment: video_id=${video_id}, content=${content}, user_id=${user_id}`);
  const response = await fetch(`${API_BASE_URL}/videos/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ video_id, content, user_id }),
  });

  if (response.ok) {
    console.log("Comment posted successfully");
  } else {
    const errorData = await response.json();
    console.error(`Failed to post comment: ${JSON.stringify(errorData)}`);
    throw new Error(errorData.detail || "Failed to post comment");
  }
};
