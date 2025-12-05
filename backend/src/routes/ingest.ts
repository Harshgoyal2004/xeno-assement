import { Router } from 'express';
import { syncShopifyData } from '../services/shopifyService';
import prisma from '../prisma/client';

const router = Router();

router.post('/', async (req, res) => {
    try {
        const { tenantId } = req.body;

        if (!tenantId) {
            // For demo purposes, create a default tenant if none provided
            let defaultTenant = await prisma.tenant.findFirst({ where: { name: 'Demo Store' } });
            if (!defaultTenant) {
                defaultTenant = await prisma.tenant.create({
                    data: {
                        name: 'Demo Store',
                        shopifyDomain: 'demo.myshopify.com',
                        accessToken: 'mock_token',
                    },
                });
            }

            const result = await syncShopifyData(defaultTenant.id);
            res.json({ ...result, tenantId: defaultTenant.id });
        } else {
            const result = await syncShopifyData(tenantId);
            res.json(result);
        }

    } catch (error) {
        console.error('Ingestion error:', error);
        res.status(500).json({ error: 'Failed to ingest data', details: error instanceof Error ? error.message : String(error) });
    }
});

export default router;
