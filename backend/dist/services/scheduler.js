"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startScheduler = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const client_1 = __importDefault(require("../prisma/client"));
const shopifyService_1 = require("./shopifyService");
const startScheduler = () => {
    console.log('Starting scheduler...');
    // Run every 5 minutes
    node_cron_1.default.schedule('*/5 * * * *', async () => {
        console.log('Running scheduled sync...');
        try {
            const tenants = await client_1.default.tenant.findMany();
            for (const tenant of tenants) {
                await (0, shopifyService_1.syncShopifyData)(tenant.id);
            }
        }
        catch (error) {
            console.error('Scheduled sync failed:', error);
        }
    });
};
exports.startScheduler = startScheduler;
