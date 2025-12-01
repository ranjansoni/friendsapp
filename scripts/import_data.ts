import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
    console.log('Starting data import...');

    const inputPath = path.join(__dirname, '..', 'data_dump.json');
    if (!fs.existsSync(inputPath)) {
        console.error('Data dump file not found:', inputPath);
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

    // Import Friends
    console.log(`Importing ${data.friends.length} friends...`);
    for (const friend of data.friends) {
        await prisma.friend.upsert({
            where: { id: friend.id },
            update: friend,
            create: friend,
        });
    }

    // Import Wishes
    console.log(`Importing ${data.wishes.length} wishes...`);
    for (const wish of data.wishes) {
        await prisma.birthdayWish.upsert({
            where: { id: wish.id },
            update: wish,
            create: wish,
        });
    }

    // Import Reminders
    console.log(`Importing ${data.reminders.length} reminders...`);
    for (const reminder of data.reminders) {
        await prisma.reminder.upsert({
            where: { id: reminder.id },
            update: reminder,
            create: reminder,
        });
    }

    console.log('Data import complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
