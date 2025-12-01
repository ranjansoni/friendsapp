import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting database verification...');

    // 1. Create a friend
    console.log('1. Testing Create Friend...');
    const friend = await prisma.friend.create({
        data: {
            fullName: 'Test Friend',
            country: 'Test Country',
            email: 'test@example.com',
            birthMonth: 1,
            birthDay: 1,
            birthYear: 1990,
            notes: 'Test notes',
        },
    });
    console.log('Created friend:', friend.id);

    // 2. Read friend
    console.log('2. Testing Read Friend...');
    const fetchedFriend = await prisma.friend.findUnique({
        where: { id: friend.id },
    });
    if (!fetchedFriend) throw new Error('Friend not found');
    console.log('Found friend:', fetchedFriend.fullName);

    // 3. Update friend
    console.log('3. Testing Update Friend...');
    const updatedFriend = await prisma.friend.update({
        where: { id: friend.id },
        data: { fullName: 'Updated Test Friend' },
    });
    console.log('Updated friend:', updatedFriend.fullName);

    // 4. Delete friend
    console.log('4. Testing Delete Friend...');
    await prisma.friend.delete({
        where: { id: friend.id },
    });
    console.log('Deleted friend');

    console.log('Verification complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
