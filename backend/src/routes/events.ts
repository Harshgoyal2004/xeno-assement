import { Router } from 'express';
import prisma from '../prisma/client';

const router = Router();

// Endpoint for custom events (e.g., from a storefront pixel)
router.post('/cart-abandoned', async (req, res) => {
    try {
        const { cartId, checkoutUrl, totalPrice, tenantId } = req.body;

        if (!cartId || !totalPrice || !tenantId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        const abandonment = await prisma.cartAbandonment.create({
            data: {
                cartId,
                checkoutUrl: checkoutUrl || '',
                totalPrice: parseFloat(totalPrice),
                tenantId,
            },
        });

        console.log(`Cart Abandoned recorded for tenant ${tenantId}: ${totalPrice}`);
        res.status(201).json(abandonment);
    } catch (error) {
        console.error('Event error:', error);
        res.status(500).json({ error: 'Failed to record event' });
    }
});

export default router;
