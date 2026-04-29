"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
// GET /colleges — search, filter, paginate
router.get('/', async (req, res) => {
    try {
        const { search, location, minFees, maxFees, minRating, type, sortBy = 'rating', order = 'desc', page = '1', limit = '12', } = req.query;
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 12));
        const skip = (pageNum - 1) * limitNum;
        const where = {};
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
            if (minFees)
                where.fees.gte = parseFloat(minFees);
            if (maxFees)
                where.fees.lte = parseFloat(maxFees);
        }
        if (minRating) {
            where.rating = { gte: parseFloat(minRating) };
        }
        const validSortFields = ['rating', 'fees', 'placementPercentage', 'name'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'rating';
        const sortOrder = order === 'asc' ? 'asc' : 'desc';
        const [colleges, total] = await Promise.all([
            prisma_1.default.college.findMany({
                where,
                skip,
                take: limitNum,
                orderBy: { [sortField]: sortOrder },
            }),
            prisma_1.default.college.count({ where }),
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
    }
    catch (error) {
        console.error('List colleges error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// GET /colleges/locations — unique locations for filter dropdown
router.get('/locations', async (_req, res) => {
    try {
        const colleges = await prisma_1.default.college.findMany({
            select: { location: true },
            distinct: ['location'],
            orderBy: { location: 'asc' },
        });
        res.json(colleges.map((c) => c.location));
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
// GET /colleges/:id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const college = await prisma_1.default.college.findUnique({ where: { id: id } });
        if (!college) {
            res.status(404).json({ error: 'College not found' });
            return;
        }
        res.json(college);
    }
    catch (error) {
        console.error('Get college error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
