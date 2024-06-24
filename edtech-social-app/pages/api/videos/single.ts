import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { video_id } = req.query;
  const video = await prisma.video.findUnique({
    where: { id: video_id as string },
  });
  res.json(video);
}
