"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncShopifyData = void 0;
const client_1 = __importDefault(require("../prisma/client"));
// Mock data generators
const generateMockCustomers = (count) => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `gid://shopify/Customer/${i + 1000}`,
        email: `customer${i}@example.com`,
        firstName: `John${i}`,
        lastName: `Doe${i}`,
        totalSpent: Math.floor(Math.random() * 1000),
        ordersCount: Math.floor(Math.random() * 10),
    }));
};
const generateMockProducts = (count) => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `gid://shopify/Product/${i + 2000}`,
        title: `Product ${i}`,
        price: (Math.random() * 100).toFixed(2),
    }));
};
const generateMockOrders = (count, customerIds) => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `gid://shopify/Order/${i + 3000}`,
        totalPrice: (Math.random() * 200).toFixed(2),
        currency: 'USD',
        createdAt: new Date().toISOString(),
        customer: {
            id: customerIds[Math.floor(Math.random() * customerIds.length)],
        },
    }));
};
const syncShopifyData = async (tenantId) => {
    console.log(`Starting sync for tenant: ${tenantId}`);
    // 1. Fetch Data (Mock)
    const customers = generateMockCustomers(10);
    const products = generateMockProducts(5);
    const orders = generateMockOrders(15, customers.map(c => c.id));
    // 2. Upsert Customers
    for (const customer of customers) {
        await client_1.default.customer.upsert({
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
                totalSpent: customer.totalSpent,
                ordersCount: customer.ordersCount,
            },
            create: {
                shopifyId: customer.id,
                email: customer.email,
                firstName: customer.firstName,
                lastName: customer.lastName,
                totalSpent: customer.totalSpent,
                ordersCount: customer.ordersCount,
                tenantId,
            },
        });
    }
    console.log('Customers synced');
    // 3. Upsert Products
    for (const product of products) {
        await client_1.default.product.upsert({
            where: {
                shopifyId_tenantId: {
                    shopifyId: product.id,
                    tenantId,
                },
            },
            update: {
                title: product.title,
                price: parseFloat(product.price),
            },
            create: {
                shopifyId: product.id,
                title: product.title,
                price: parseFloat(product.price),
                tenantId,
            },
        });
    }
    console.log('Products synced');
    // 4. Upsert Orders
    for (const order of orders) {
        // Find internal customer ID
        const customer = await client_1.default.customer.findUnique({
            where: {
                shopifyId_tenantId: {
                    shopifyId: order.customer.id,
                    tenantId
                }
            }
        });
        if (customer) {
            await client_1.default.order.upsert({
                where: {
                    shopifyId_tenantId: {
                        shopifyId: order.id,
                        tenantId,
                    },
                },
                update: {
                    totalPrice: parseFloat(order.totalPrice),
                    currency: order.currency,
                    createdAt: order.createdAt,
                    customerId: customer.id,
                },
                create: {
                    shopifyId: order.id,
                    totalPrice: parseFloat(order.totalPrice),
                    currency: order.currency,
                    createdAt: order.createdAt,
                    customerId: customer.id,
                    tenantId,
                },
            });
        }
    }
    console.log('Orders synced');
    return { status: 'success', message: 'Data synced successfully' };
};
exports.syncShopifyData = syncShopifyData;
