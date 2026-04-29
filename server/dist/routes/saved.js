"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
// POST /save — save a college
router.post('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const { collegeId } = req.body;
        if (!collegeId) {
            res.status(400).json({ error: 'collegeId is required' });
            return;
        }
        const college = await prisma_1.default.college.findUnique({ where: { id: collegeId } });
        if (!college) {
            res.status(404).json({ error: 'College not found' });
            return;
        }
        const existing = await prisma_1.default.savedCollege.findUnique({
            where: { userId_collegeId: { userId: req.userId, collegeId } },
        });
        if (existing) {
            res.status(409).json({ error: 'College already saved' });
            return;
        }
        const saved = await prisma_1.default.savedCollege.create({
            data: { userId: req.userId, collegeId },
            include: { college: true },
        });
        res.status(201).json(saved);
    }
    catch (error) {
        console.error('Save college error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// GET /saved — get user's saved colleges
router.get('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const saved = await prisma_1.default.savedCollege.findMany({
            where: { userId: req.userId },
            include: { college: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json(saved);
    }
    catch (error) {
        console.error('Get saved error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// DELETE /saved/:id — unsave a college
router.delete('/:collegeId', auth_1.authMiddleware, async (req, res) => {
    try {
        const collegeId = req.params.collegeId;
        const existing = await prisma_1.default.savedCollege.findUnique({
            where: { userId_collegeId: { userId: req.userId, collegeId } },
        });
        if (!existing) {
            res.status(404).json({ error: 'Saved college not found' });
            return;
        }
        await prisma_1.default.savedCollege.delete({
            where: { id: existing.id },
        });
        res.json({ message: 'College removed from saved' });
    }
    catch (error) {
        console.error('Delete saved error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
