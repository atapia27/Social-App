import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/videos/comments?video_id=<video_id>
const getComments = async (req: NextApiRequest, res: NextApiResponse) => {
  const { video_id } = req.query;

  try {
    const comments = await prisma.comment.findMany({
      where: { video_id: video_id as string },
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// POST /api/videos/comments
const createComment = async (req: NextApiRequest, res: NextApiResponse) => {
  const { video_id, content, user_id } = req.body;

  try {
    const newComment = await prisma.comment.create({
      data: {
        video_id,
        content,
        user_id,
      },
    });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      await getComments(req, res);
      break;
    case 'POST':
      await createComment(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
