"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shopifyService_1 = require("../services/shopifyService");
const client_1 = __importDefault(require("../prisma/client"));
const router = (0, express_1.Router)();
router.post('/', async (req, res) => {
    try {
        const { tenantId } = req.body;
        if (!tenantId) {
            // For demo purposes, create a default tenant if none provided
            let defaultTenant = await client_1.default.tenant.findFirst({ where: { name: 'Demo Store' } });
            if (!defaultTenant) {
                defaultTenant = await client_1.default.tenant.create({
                    data: {
                        name: 'Demo Store',
                        shopifyDomain: 'demo.myshopify.com',
                        accessToken: 'mock_token',
                    },
                });
            }
            const result = await (0, shopifyService_1.syncShopifyData)(defaultTenant.id);
            res.json({ ...result, tenantId: defaultTenant.id });
        }
        else {
            const result = await (0, shopifyService_1.syncShopifyData)(tenantId);
            res.json(result);
        }
    }
    catch (error) {
        console.error('Ingestion error:', error);
        res.status(500).json({ error: 'Failed to ingest data' });
    }
});
exports.default = router;
