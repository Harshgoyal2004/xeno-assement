import cron from 'node-cron';
import prisma from '../prisma/client';
import { syncShopifyData } from './shopifyService';

export const startScheduler = () => {
    console.log('Starting scheduler...');

    // Run every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
        console.log('Running scheduled sync...');
        try {
            const tenants = await prisma.tenant.findMany();
            for (const tenant of tenants) {
                await syncShopifyData(tenant.id);
            }
        } catch (error) {
            console.error('Scheduled sync failed:', error);
        }
    });
};
