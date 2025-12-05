
import prisma from '../prisma/client';

async function main() {
    console.log('Checking Prisma Client fields...');
    if ('cartAbandonment' in prisma) {
        console.log('✅ prisma.cartAbandonment exists!');
    } else {
        console.log('❌ prisma.cartAbandonment does NOT exist.');
        console.log('Available keys:', Object.keys(prisma));
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
