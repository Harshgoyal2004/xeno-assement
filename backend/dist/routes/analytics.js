"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = __importDefault(require("../prisma/client"));
const router = (0, express_1.Router)();
// Middleware to get tenantId (simplified for demo)
const getTenantId = (req) => {
    // In a real app, this would come from auth token or subdomain
    return req.query.tenantId;
};
router.get('/stats', async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (!tenantId)
            return res.status(400).json({ error: 'Tenant ID required' });
        const [totalSales, ordersCount, customersCount] = await Promise.all([
            client_1.default.order.aggregate({
                where: { tenantId },
                _sum: { totalPrice: true },
            }),
            client_1.default.order.count({ where: { tenantId } }),
            client_1.default.customer.count({ where: { tenantId } }),
        ]);
        res.json({
            totalSales: totalSales._sum.totalPrice || 0,
            ordersCount,
            customersCount,
        });
    }
    catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});
router.get('/sales-over-time', async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        const { startDate, endDate } = req.query;
        if (!tenantId)
            return res.status(400).json({ error: 'Tenant ID required' });
        const whereClause = { tenantId };
        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate)
                whereClause.createdAt.gte = new Date(startDate);
            if (endDate)
                whereClause.createdAt.lte = new Date(endDate);
        }
        // Group by date (simplified: fetching all and processing in JS for SQLite compatibility)
        // Prisma GroupBy is supported, but date truncation in SQLite is tricky with Prisma
        const orders = await client_1.default.order.findMany({
            where: whereClause,
            select: { createdAt: true, totalPrice: true },
            orderBy: { createdAt: 'asc' },
        });
        const salesByDate = {};
        orders.forEach((order) => {
            const date = order.createdAt.toISOString().split('T')[0];
            salesByDate[date] = (salesByDate[date] || 0) + order.totalPrice;
        });
        const chartData = Object.entries(salesByDate).map(([date, sales]) => ({
            date,
            sales,
        }));
        res.json(chartData);
    }
    catch (error) {
        console.error('Sales over time error:', error);
        res.status(500).json({ error: 'Failed to fetch sales over time' });
    }
});
router.get('/top-customers', async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (!tenantId)
            return res.status(400).json({ error: 'Tenant ID required' });
        const topCustomers = await client_1.default.customer.findMany({
            where: { tenantId },
            orderBy: { totalSpent: 'desc' },
            take: 5,
            select: {
                firstName: true,
                lastName: true,
                email: true,
                totalSpent: true,
                ordersCount: true,
            },
        });
        res.json(topCustomers);
    }
    catch (error) {
        console.error('Top customers error:', error);
        res.status(500).json({ error: 'Failed to fetch top customers' });
    }
});
exports.default = router;
