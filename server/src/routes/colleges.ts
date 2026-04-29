import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET /colleges — search, filter, paginate
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      location,
      minFees,
      maxFees,
      minRating,
      type,
      sortBy = 'rating',
      order = 'desc',
      page = '1',
      limit = '12',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string) || 12));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (search && typeof search === 'string') {
      where.name = { contains: search };
    }

    if (location && typeof location === 'string') {
      where.location = location;
    }

    if (type && typeof type === 'string') {
      where.type = type;
    }

    if (minFees || maxFees) {
      where.fees = {};
      if (minFees) where.fees.gte = parseFloat(minFees as string);
      if (maxFees) where.fees.lte = parseFloat(maxFees as string);
    }

    if (minRating) {
      where.rating = { gte: parseFloat(minRating as string) };
    }

    const validSortFields = ['rating', 'fees', 'placementPercentage', 'name'];
    const sortField = validSortFields.includes(sortBy as string) ? (sortBy as string) : 'rating';
    const sortOrder = order === 'asc' ? 'asc' : 'desc';

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { [sortField]: sortOrder },
      }),
      prisma.college.count({ where }),
    ]);

    res.json({
      colleges,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('List colleges error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /colleges/locations — unique locations for filter dropdown
router.get('/locations', async (_req: Request, res: Response): Promise<void> => {
  try {
    const colleges = await prisma.college.findMany({
      select: { location: true },
      distinct: ['location'] as any,
      orderBy: { location: 'asc' },
    });
    res.json(colleges.map((c: { location: string }) => c.location));
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /colleges/:id
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const college = await prisma.college.findUnique({ where: { id: id as string } });
    if (!college) {
      res.status(404).json({ error: 'College not found' });
      return;
    }

    res.json(college);
  } catch (error) {
    console.error('Get college error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
