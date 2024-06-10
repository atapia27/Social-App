import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { videoId, content } = req.body;
    const comment = await prisma.comment.create({ data: { content, videoId } });
    res.json(comment);
  }
}
