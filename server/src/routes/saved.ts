import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

// POST /save — save a college
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { collegeId } = req.body;

    if (!collegeId) {
      res.status(400).json({ error: 'collegeId is required' });
      return;
    }

    const college = await prisma.college.findUnique({ where: { id: collegeId } });
    if (!college) {
      res.status(404).json({ error: 'College not found' });
      return;
    }

    const existing = await prisma.savedCollege.findUnique({
      where: { userId_collegeId: { userId: req.userId!, collegeId } },
    });

    if (existing) {
      res.status(409).json({ error: 'College already saved' });
      return;
    }

    const saved = await prisma.savedCollege.create({
      data: { userId: req.userId!, collegeId },
      include: { college: true },
    });

    res.status(201).json(saved);
  } catch (error) {
    console.error('Save college error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /saved — get user's saved colleges
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const saved = await prisma.savedCollege.findMany({
      where: { userId: req.userId! },
      include: { college: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(saved);
  } catch (error) {
    console.error('Get saved error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /saved/:id — unsave a college
router.delete('/:collegeId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { collegeId } = req.params;

    const existing = await prisma.savedCollege.findUnique({
      where: { userId_collegeId: { userId: req.userId!, collegeId } },
    });

    if (!existing) {
      res.status(404).json({ error: 'Saved college not found' });
      return;
    }

    await prisma.savedCollege.delete({
      where: { id: existing.id },
    });

    res.json({ message: 'College removed from saved' });
  } catch (error) {
    console.error('Delete saved error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
