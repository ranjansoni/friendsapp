import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const count = await prisma.friend.count();
    console.log(`Total friends in database: ${count}`);

    const friends = await prisma.friend.findMany({
        select: {
            id: true,
            fullName: true,
        },
        orderBy: {
            fullName: 'asc',
        },
    });

    console.log('\nFriends list:');
    friends.forEach((f, i) => {
        console.log(`${i + 1}. ${f.fullName}`);
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
