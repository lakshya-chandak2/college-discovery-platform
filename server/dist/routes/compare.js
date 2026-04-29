"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
const compareSchema = zod_1.z.object({
    ids: zod_1.z.array(zod_1.z.string()).min(2, 'At least 2 colleges required').max(3, 'Maximum 3 colleges allowed'),
});
// POST /compare
router.post('/', async (req, res) => {
    try {
        const parsed = compareSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.errors[0].message });
            return;
        }
        const { ids } = parsed.data;
        const colleges = await prisma_1.default.college.findMany({
            where: { id: { in: ids } },
        });
        if (colleges.length < 2) {
            res.status(400).json({ error: 'Could not find enough valid colleges to compare' });
            return;
        }
        res.json({ colleges });
    }
    catch (error) {
        console.error('Compare error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
