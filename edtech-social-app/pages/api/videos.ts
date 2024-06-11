import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/videos?user_id=<user_id>
const getVideos = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user_id } = req.query;

  try {
    const videos = await prisma.video.findMany({
      where: { user_id: user_id as string },
    });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};

// POST /api/videos
const createVideo = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user_id, description, video_url, title } = req.body;

  try {
    const newVideo = await prisma.video.create({
      data: {
        user_id,
        description,
        video_url,
        title,
      },
    });
    res.status(201).json(newVideo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create video' });
  }
};

// PUT /api/videos
const updateVideo = async (req: NextApiRequest, res: NextApiResponse) => {
  const { video_id, title, description } = req.body;

  try {
    const updatedVideo = await prisma.video.update({
      where: { id: video_id },
      data: {
        title,
        description,
      },
    });
    res.status(200).json(updatedVideo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update video' });
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      await getVideos(req, res);
      break;
    case 'POST':
      await createVideo(req, res);
      break;
    case 'PUT':
      await updateVideo(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
