import { Router } from 'express';
import prisma from '../prisma/client';

const router = Router();

// Middleware to get tenantId (simplified for demo)
const getTenantId = (req: any) => {
    // In a real app, this would come from auth token or subdomain
    return req.query.tenantId as string;
};

router.get('/stats', async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (!tenantId) return res.status(400).json({ error: 'Tenant ID required' });

        const [totalSales, ordersCount, customersCount] = await Promise.all([
            prisma.order.aggregate({
                where: { tenantId },
                _sum: { totalPrice: true },
            }),
            prisma.order.count({ where: { tenantId } }),
            prisma.customer.count({ where: { tenantId } }),
        ]);

        res.json({
            totalSales: totalSales._sum.totalPrice || 0,
            ordersCount,
            customersCount,
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

router.get('/sales-over-time', async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        const { startDate, endDate } = req.query;

        if (!tenantId) return res.status(400).json({ error: 'Tenant ID required' });

        const whereClause: any = { tenantId };
        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) whereClause.createdAt.gte = new Date(startDate as string);
            if (endDate) whereClause.createdAt.lte = new Date(endDate as string);
        }

        // Group by date (simplified: fetching all and processing in JS for SQLite compatibility)
        // Prisma GroupBy is supported, but date truncation in SQLite is tricky with Prisma
        const orders = await prisma.order.findMany({
            where: whereClause,
            select: { createdAt: true, totalPrice: true },
            orderBy: { createdAt: 'asc' },
        });

        const salesByDate: Record<string, number> = {};
        orders.forEach((order: { createdAt: Date; totalPrice: number }) => {
            const date = order.createdAt.toISOString().split('T')[0];
            salesByDate[date] = (salesByDate[date] || 0) + order.totalPrice;
        });

        const chartData = Object.entries(salesByDate).map(([date, sales]) => ({
            date,
            sales,
        }));

        res.json(chartData);
    } catch (error) {
        console.error('Sales over time error:', error);
        res.status(500).json({ error: 'Failed to fetch sales over time' });
    }
});

router.get('/top-customers', async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (!tenantId) return res.status(400).json({ error: 'Tenant ID required' });

        const topCustomers = await prisma.customer.findMany({
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
    } catch (error) {
        console.error('Top customers error:', error);
        res.status(500).json({ error: 'Failed to fetch top customers' });
    }
});

// Get sales by city (Geo Distribution)
router.get('/geo-distribution', async (req, res) => {
    try {
        const { tenantId } = req.query;
        if (!tenantId) return res.status(400).json({ error: 'Tenant ID required' });

        const customers = await prisma.customer.findMany({
            where: { tenantId: String(tenantId), city: { not: null } },
            select: { city: true, totalSpent: true }
        });

        const cityStats: Record<string, number> = {};
        customers.forEach(c => {
            if (c.city) {
                cityStats[c.city] = (cityStats[c.city] || 0) + c.totalSpent;
            }
        });

        const result = Object.entries(cityStats)
            .map(([city, sales]) => ({ city, sales }))
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 10); // Top 10 cities

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch geo stats' });
    }
});

// Get sales by category
router.get('/category-sales', async (req, res) => {
    try {
        const { tenantId } = req.query;
        if (!tenantId) return res.status(400).json({ error: 'Tenant ID required' });

        // Since we don't have direct link from Order -> Product in this simple schema,
        // we will approximate by fetching all products and their prices, 
        // OR better: we can group products by category and count them for now, 
        // but for "Sales" we need OrderItems. 
        // Given the schema limitations (Order only has total price), we will visualize "Product Distribution" instead of "Sales by Category"
        // OR we can mock the sales distribution based on product count.

        // Let's return Product Count by Category for now as a proxy
        const products = await prisma.product.findMany({
            where: { tenantId: String(tenantId), category: { not: null } }
        });

        const categoryStats: Record<string, number> = {};
        products.forEach(p => {
            if (p.category) {
                categoryStats[p.category] = (categoryStats[p.category] || 0) + 1;
            }
        });

        const result = Object.entries(categoryStats)
            .map(([category, count]) => ({ category, count }));

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch category stats' });
    }
});

// Get customer retention (Repeat vs One-time)
router.get('/customer-retention', async (req, res) => {
    try {
        const { tenantId } = req.query;
        if (!tenantId) return res.status(400).json({ error: 'Tenant ID required' });

        const customers = await prisma.customer.findMany({
            where: { tenantId: String(tenantId) },
            select: { ordersCount: true }
        });

        let oneTime = 0;
        let repeat = 0;

        customers.forEach(c => {
            if (c.ordersCount > 1) repeat++;
            else if (c.ordersCount === 1) oneTime++;
        });

        res.json({ oneTime, repeat });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch retention stats' });
    }
});

// Get RFM Segments
router.get('/rfm-segments', async (req, res) => {
    try {
        const { tenantId } = req.query;
        if (!tenantId) return res.status(400).json({ error: 'Tenant ID required' });

        // Fetch customers with their orders to calculate Recency
        const customers = await prisma.customer.findMany({
            where: { tenantId: String(tenantId) },
            include: {
                orders: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: { createdAt: true }
                }
            }
        });

        const segments = {
            Champions: 0,
            Loyal: 0,
            AtRisk: 0,
            Lost: 0,
            New: 0
        };

        // Find the most recent order date across all customers to use as "now"
        // This ensures the demo data (which might be old) doesn't classify everyone as "Lost"
        const latestOrder = await prisma.order.findFirst({
            where: { tenantId: String(tenantId) },
            orderBy: { createdAt: 'desc' },
            select: { createdAt: true }
        });

        const now = latestOrder ? new Date(latestOrder.createdAt) : new Date();

        customers.forEach(c => {
            const lastOrderDate = c.orders[0]?.createdAt;
            const recencyDays = lastOrderDate
                ? Math.floor((now.getTime() - new Date(lastOrderDate).getTime()) / (1000 * 60 * 60 * 24))
                : 999; // No orders

            const frequency = c.ordersCount;
            const monetary = c.totalSpent;

            // Simple RFM Logic
            if (recencyDays < 30 && frequency > 3 && monetary > 5000) {
                segments.Champions++;
            } else if (frequency > 2 && recencyDays < 60) {
                segments.Loyal++;
            } else if (recencyDays > 90 && frequency > 0) {
                segments.Lost++;
            } else if (recencyDays > 60) {
                segments.AtRisk++;
            } else {
                segments.New++;
            }
        });

        const result = Object.entries(segments).map(([name, value]) => ({ name, value }));
        res.json(result);
    } catch (error) {
        console.error('RFM error:', error);
        res.status(500).json({ error: 'Failed to fetch RFM segments' });
    }
});

// Get Cart Abandonment Stats
router.get('/cart-abandonment', async (req, res) => {
    try {
        const { tenantId } = req.query;
        if (!tenantId) return res.status(400).json({ error: 'Tenant ID required' });

        const stats = await prisma.cartAbandonment.aggregate({
            where: { tenantId: String(tenantId) },
            _sum: { totalPrice: true },
            _count: { id: true }
        });

        res.json({
            totalLostRevenue: stats._sum.totalPrice || 0,
            abandonedCartsCount: stats._count.id || 0
        });
    } catch (error) {
        console.error('Cart abandonment error:', error);
        res.status(500).json({ error: 'Failed to fetch cart abandonment stats' });
    }
});

// Get AOV Trend
router.get('/aov-trend', async (req, res) => {
    try {
        const { tenantId, startDate, endDate } = req.query;
        if (!tenantId) return res.status(400).json({ error: 'Tenant ID required' });

        const whereClause: any = { tenantId: String(tenantId) };
        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) whereClause.createdAt.gte = new Date(startDate as string);
            if (endDate) whereClause.createdAt.lte = new Date(endDate as string);
        }

        const orders = await prisma.order.findMany({
            where: whereClause,
            select: { createdAt: true, totalPrice: true },
            orderBy: { createdAt: 'asc' }
        });

        const dailyStats: Record<string, { sales: number; count: number }> = {};

        orders.forEach(order => {
            const date = order.createdAt.toISOString().split('T')[0];
            if (!dailyStats[date]) dailyStats[date] = { sales: 0, count: 0 };
            dailyStats[date].sales += order.totalPrice;
            dailyStats[date].count += 1;
        });

        const chartData = Object.entries(dailyStats).map(([date, stats]) => ({
            date,
            aov: Math.round(stats.sales / stats.count)
        }));

        res.json(chartData);
    } catch (error) {
        console.error('AOV error:', error);
        res.status(500).json({ error: 'Failed to fetch AOV trend' });
    }
});

export default router;
