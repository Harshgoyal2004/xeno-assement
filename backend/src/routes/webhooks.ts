import { Router } from 'express';
import crypto from 'crypto';
import prisma from '../prisma/client';

const router = Router();

const verifyShopifyWebhook = (req: any, res: any, next: any) => {
    const hmac = req.get('X-Shopify-Hmac-Sha256');
    const topic = req.get('X-Shopify-Topic');
    const shop = req.get('X-Shopify-Shop-Domain');

    // In a real app, you would verify the HMAC against your App Secret
    // const generatedHash = crypto
    //     .createHmac('sha256', process.env.SHOPIFY_API_SECRET!)
    //     .update(req.rawBody, 'utf8')
    //     .digest('base64');

    // if (generatedHash !== hmac) {
    //     return res.status(401).send('HMAC validation failed');
    // }

    console.log(`Received Webhook: ${topic} from ${shop}`);
    next();
};

router.post('/shopify', verifyShopifyWebhook, async (req, res) => {
    const topic = req.get('X-Shopify-Topic');
    const shop = req.get('X-Shopify-Shop-Domain');
    const payload = req.body;

    try {
        const tenant = await prisma.tenant.findUnique({ where: { shopifyDomain: shop } });
        if (!tenant) {
            console.log(`Tenant not found for shop: ${shop}`);
            return res.status(200).send('Tenant not found, ignoring');
        }

        if (topic === 'customers/create' || topic === 'customers/update') {
            await prisma.customer.upsert({
                where: { shopifyId_tenantId: { shopifyId: `gid://shopify/Customer/${payload.id}`, tenantId: tenant.id } },
                update: {
                    email: payload.email,
                    firstName: payload.first_name,
                    lastName: payload.last_name,
                    totalSpent: parseFloat(payload.total_spent || '0'),
                    ordersCount: payload.orders_count || 0,
                },
                create: {
                    shopifyId: `gid://shopify/Customer/${payload.id}`,
                    email: payload.email,
                    firstName: payload.first_name,
                    lastName: payload.last_name,
                    totalSpent: parseFloat(payload.total_spent || '0'),
                    ordersCount: payload.orders_count || 0,
                    tenantId: tenant.id,
                },
            });
        } else if (topic === 'products/create' || topic === 'products/update') {
            await prisma.product.upsert({
                where: { shopifyId_tenantId: { shopifyId: `gid://shopify/Product/${payload.id}`, tenantId: tenant.id } },
                update: {
                    title: payload.title,
                    price: parseFloat(payload.variants[0]?.price || '0'),
                },
                create: {
                    shopifyId: `gid://shopify/Product/${payload.id}`,
                    title: payload.title,
                    price: parseFloat(payload.variants[0]?.price || '0'),
                    tenantId: tenant.id,
                },
            });
        } else if (topic === 'orders/create') {
            const customerId = payload.customer ? `gid://shopify/Customer/${payload.customer.id}` : null;
            let dbCustomer = null;

            if (customerId) {
                dbCustomer = await prisma.customer.findUnique({
                    where: { shopifyId_tenantId: { shopifyId: customerId, tenantId: tenant.id } }
                });
            }

            if (dbCustomer) {
                await prisma.order.create({
                    data: {
                        shopifyId: `gid://shopify/Order/${payload.id}`,
                        totalPrice: parseFloat(payload.total_price),
                        currency: payload.currency,
                        createdAt: new Date(payload.created_at),
                        customerId: dbCustomer.id,
                        tenantId: tenant.id,
                    }
                });
            }
        }

        res.status(200).send('Webhook processed');
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).send('Webhook failed');
    }
});

export default router;
