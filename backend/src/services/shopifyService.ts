import prisma from '../prisma/client';
import axios from 'axios';
import { MOCK_CUSTOMERS, MOCK_PRODUCTS, MOCK_ORDERS } from '../data/mockData';

// Real Shopify API Helpers
const fetchShopifyCustomers = async (domain: string, token: string) => {
    const response = await axios.get(`https://${domain}/admin/api/2024-01/customers.json?limit=250`, {
        headers: { 'X-Shopify-Access-Token': token }
    });
    return response.data.customers.map((c: any) => ({
        id: `gid://shopify/Customer/${c.id}`,
        email: c.email,
        firstName: c.first_name,
        lastName: c.last_name,
        city: c.default_address?.city || null,
        country: c.default_address?.country || null,
        totalSpent: parseFloat(c.total_spent || '0'),
        ordersCount: c.orders_count || 0,
    }));
};

const fetchShopifyProducts = async (domain: string, token: string) => {
    const response = await axios.get(`https://${domain}/admin/api/2024-01/products.json?limit=250`, {
        headers: { 'X-Shopify-Access-Token': token }
    });
    return response.data.products.map((p: any) => ({
        id: `gid://shopify/Product/${p.id}`,
        title: p.title,
        category: p.product_type || 'Uncategorized',
        price: p.variants[0]?.price || '0',
    }));
};

const fetchShopifyOrders = async (domain: string, token: string) => {
    const response = await axios.get(`https://${domain}/admin/api/2024-01/orders.json?status=any&limit=250`, {
        headers: { 'X-Shopify-Access-Token': token }
    });
    return response.data.orders.map((o: any) => ({
        id: `gid://shopify/Order/${o.id}`,
        totalPrice: parseFloat(o.total_price || '0'),
        currency: o.currency,
        createdAt: o.created_at,
        customer: {
            id: o.customer ? `gid://shopify/Customer/${o.customer.id}` : null,
        },
    }));
};

export const syncShopifyData = async (tenantId: string) => {
    console.log(`Starting sync for tenant: ${tenantId}`);

    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new Error('Tenant not found');

    let customers, products, orders;

    // Check if we have real credentials
    if (tenant.accessToken && tenant.accessToken !== 'mock_token' && tenant.shopifyDomain !== 'demo.myshopify.com') {
        console.log('Using REAL Shopify API');
        try {
            customers = await fetchShopifyCustomers(tenant.shopifyDomain, tenant.accessToken);
            products = await fetchShopifyProducts(tenant.shopifyDomain, tenant.accessToken);
            orders = await fetchShopifyOrders(tenant.shopifyDomain, tenant.accessToken);
        } catch (error) {
            console.error('Failed to fetch from Shopify API, falling back to mock data', error);
            // Fallback to mock if API fails (e.g. invalid token)
            customers = MOCK_CUSTOMERS;
            products = MOCK_PRODUCTS;
            orders = MOCK_ORDERS.map(o => ({
                ...o,
                customer: { id: o.customerId }
            }));
        }
    } else {
        console.log('Using MOCK Data');

        // CLEAR EXISTING DATA FOR DEMO TENANT TO PREVENT ACCUMULATION
        console.log('Clearing existing mock data...');
        await prisma.order.deleteMany({ where: { customer: { tenantId } } });
        await prisma.product.deleteMany({ where: { tenantId } });
        await prisma.customer.deleteMany({ where: { tenantId } });

        customers = MOCK_CUSTOMERS;
        products = MOCK_PRODUCTS;

        // GENERATE DYNAMIC ORDERS FOR THE LAST 90 DAYS
        orders = [];
        const now = new Date();
        const infoLog: string[] = [];

        for (let i = 0; i < 90; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);

            // Random number of orders per day (1 to 10)
            // Creating variance: weekends might have more orders, or just random
            const numOrders = Math.floor(Math.random() * 10) + 1;

            for (let j = 0; j < numOrders; j++) {
                const customer = customers[Math.floor(Math.random() * customers.length)];
                const product = products[Math.floor(Math.random() * products.length)];
                const quantity = Math.floor(Math.random() * 3) + 1;
                const totalPrice = product.price * quantity;

                orders.push({
                    id: `gid://shopify/Order/mock_${i}_${j}`,
                    totalPrice: totalPrice,
                    currency: 'INR',
                    createdAt: date.toISOString(), // simplified
                    customer: {
                        id: customer.id
                    }
                });
            }
        }
        console.log(`Generated ${orders.length} mock orders for the last 90 days.`);
    }

    // 2. Upsert Customers
    for (const customer of customers) {
        await prisma.customer.upsert({
            where: {
                shopifyId_tenantId: {
                    shopifyId: customer.id,
                    tenantId,
                },
            },
            update: {
                email: customer.email,
                firstName: customer.firstName,
                lastName: customer.lastName,
                city: customer.city,
                country: customer.country,
                totalSpent: customer.totalSpent,
                ordersCount: customer.ordersCount,
            },
            create: {
                shopifyId: customer.id,
                email: customer.email,
                firstName: customer.firstName,
                lastName: customer.lastName,
                city: customer.city,
                country: customer.country,
                totalSpent: customer.totalSpent,
                ordersCount: customer.ordersCount,
                tenantId,
            },
        });
    }
    console.log(`Synced ${customers.length} customers`);

    // 3. Upsert Products
    for (const product of products) {
        await prisma.product.upsert({
            where: {
                shopifyId_tenantId: {
                    shopifyId: product.id,
                    tenantId,
                },
            },
            update: {
                title: product.title,
                category: product.category,
                price: parseFloat(product.price),
            },
            create: {
                shopifyId: product.id,
                title: product.title,
                category: product.category,
                price: parseFloat(product.price),
                tenantId,
            },
        });
    }
    console.log(`Synced ${products.length} products`);

    // 4. Upsert Orders
    for (const order of orders) {
        if (!order.customer.id) continue; // Skip orders without customers

        // Find internal customer ID
        const customer = await prisma.customer.findUnique({
            where: {
                shopifyId_tenantId: {
                    shopifyId: order.customer.id,
                    tenantId
                }
            }
        });

        if (customer) {
            await prisma.order.upsert({
                where: {
                    shopifyId_tenantId: {
                        shopifyId: order.id,
                        tenantId,
                    },
                },
                update: {
                    totalPrice: order.totalPrice,
                    currency: order.currency || 'INR',
                    createdAt: order.createdAt,
                    customerId: customer.id,
                },
                create: {
                    shopifyId: order.id,
                    totalPrice: order.totalPrice,
                    currency: order.currency || 'INR',
                    createdAt: order.createdAt,
                    customerId: customer.id,
                    tenantId,
                },
            });
        }
    }
    console.log(`Synced ${orders.length} orders`);

    return { status: 'success', message: 'Data synced successfully' };
};
