
import prisma from '../prisma/client';

const updateCredentials = async () => {
    const domain = process.argv[2];
    const token = process.argv[3];

    if (!domain || !token) {
        console.error('Usage: ts-node src/scripts/update-credentials.ts <shopify-domain> <access-token>');
        process.exit(1);
    }

    try {
        // Update the Demo Store tenant
        const tenant = await prisma.tenant.updateMany({
            where: { name: 'Demo Store' },
            data: {
                shopifyDomain: domain,
                accessToken: token
            }
        });

        if (tenant.count > 0) {
            console.log('✅ Successfully updated credentials!');
            console.log(`Domain: ${domain}`);
            console.log('Token: [HIDDEN]');
        } else {
            console.error('❌ Demo Store tenant not found. Please run the app once to generate it.');
        }
    } catch (error) {
        console.error('Error updating credentials:', error);
    } finally {
        await prisma.$disconnect();
    }
};

updateCredentials();
