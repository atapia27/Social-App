// edtech-social-app/api/video.ts

export interface GetVideosResponse {
    created_at: string;
    video_url: string;
    user_id: string;
    description: string;
    title: string;
    num_comments: number;
    id: string; // video id 
  }
  
  export interface PostVideo {
    user_id: string;
    description: string;
    video_url: string;
    title: string;
  }
  
  export const fetchUserVideosAPI = async (user_id: string) => {
    const response = await fetch(`https://take-home-assessment-423502.uc.r.appspot.com/api/videos/?user_id=${user_id}`);
    if (response.ok) {
      const data = await response.json();
      return data.videos.map((video: GetVideosResponse) => ({
        ...video,
        id: user_id,
      }));
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  };
  
  export const addVideoAPI = async (video: PostVideo) => {
    const response = await fetch("https://take-home-assessment-423502.uc.r.appspot.com/api/videos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(video),
    });
    if (response.ok) {
      const data = await response.json();
      return {
        ...video,
        created_at: data.created_at,
        num_comments: data.num_comments,
        id: data.id,
      };
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  };
  