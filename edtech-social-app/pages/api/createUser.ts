// pages/api/createUser.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { email, username, icon } = req.body;

    try {
      const newUser = await prisma.user.create({
        data: {
          email,
          username,
          icon
        }
      });
      res.status(200).json(newUser);
    } catch (error) {
      console.error("Request error", error);
      res.status(500).json({ error: `Error creating user` });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
