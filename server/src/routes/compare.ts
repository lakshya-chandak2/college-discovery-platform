import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';

const router = Router();

const compareSchema = z.object({
  ids: z.array(z.string()).min(2, 'At least 2 colleges required').max(3, 'Maximum 3 colleges allowed'),
});

// POST /compare
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = compareSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.errors[0].message });
      return;
    }

    const { ids } = parsed.data;

    const colleges = await prisma.college.findMany({
      where: { id: { in: ids } },
    });

    if (colleges.length < 2) {
      res.status(400).json({ error: 'Could not find enough valid colleges to compare' });
      return;
    }

    res.json({ colleges });
  } catch (error) {
    console.error('Compare error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
