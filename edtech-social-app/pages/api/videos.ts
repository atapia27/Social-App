import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const videos = await prisma.video.findMany({ include: { comments: true } });
    res.json(videos);
  } else if (req.method === 'POST') {
    const { title, description, url } = req.body;
    const video = await prisma.video.create({ data: { title, description, url } });
    res.json(video);
  }
}
