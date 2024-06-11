// models/schemas.ts
export interface VideoSchema {
    video_id: string;
    user_id: string;
    description: string;
    video_url: string;
    title: string;
}

export interface CommentSchema {
    comment_id: string;
    video_id: string;
    content: string;
    user_id: string;
}

export interface EditVideo {
    video_id: string;
    description: string;
    title: string;
}
