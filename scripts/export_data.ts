import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
    console.log('Starting data export...');

    const friends = await prisma.friend.findMany();
    const wishes = await prisma.birthdayWish.findMany();
    const reminders = await prisma.reminder.findMany();

    const data = {
        friends,
        wishes,
        reminders,
    };

    const outputPath = path.join(__dirname, '..', 'data_dump.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

    console.log(`Data exported to ${outputPath}`);
    console.log(`Stats:`);
    console.log(`- Friends: ${friends.length}`);
    console.log(`- Wishes: ${wishes.length}`);
    console.log(`- Reminders: ${reminders.length}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
