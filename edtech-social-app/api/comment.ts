// edtech-social-app\api\comment.ts
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
