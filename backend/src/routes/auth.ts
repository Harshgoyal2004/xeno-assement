import { Router } from 'express';
import prisma from '../prisma/client';

const router = Router();

// Register a new user and tenant
router.post('/register', async (req, res) => {
    try {
        const { email, password, storeName } = req.body;

        if (!email || !password || !storeName) {
            return res.status(400).json({ error: 'Email, password, and store name are required' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create Tenant
        const tenant = await prisma.tenant.create({
            data: {
                name: storeName,
                shopifyDomain: `${storeName.toLowerCase().replace(/\s+/g, '-')}.myshopify.com`,
                accessToken: 'mock_token',
            },
        });

        // Create User linked to Tenant
        const user = await prisma.user.create({
            data: {
                email,
                password, // In a real app, hash this!
                tenantId: tenant.id,
            },
        });

        res.json({ user, tenantId: tenant.id });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({ user, tenantId: user.tenantId });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

export default router;
