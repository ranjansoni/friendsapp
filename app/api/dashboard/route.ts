import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentDay = today.getDate();

        // Fetch all friends to filter in memory (easier for cross-year logic)
        // For a large app, we'd want to do this in SQL, but for personal use this is fine
        const allFriends = await prisma.friend.findMany({
            select: {
                id: true,
                fullName: true,
                birthMonth: true,
                birthDay: true,
                birthYear: true,
                country: true,
            },
        });

        const upcomingBirthdays = allFriends
            .map(friend => {
                let nextBirthdayYear = today.getFullYear();
                if (
                    friend.birthMonth < currentMonth ||
                    (friend.birthMonth === currentMonth && friend.birthDay < currentDay)
                ) {
                    nextBirthdayYear++;
                }

                const nextBirthday = new Date(
                    nextBirthdayYear,
                    friend.birthMonth - 1,
                    friend.birthDay
                );

                const diffTime = nextBirthday.getTime() - today.getTime();
                const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                return {
                    ...friend,
                    nextBirthday,
                    daysUntil,
                    age: friend.birthYear ? nextBirthdayYear - friend.birthYear : null,
                };
            })
            .filter(f => f.daysUntil >= 0 && f.daysUntil <= 30) // Next 30 days
            .sort((a, b) => a.daysUntil - b.daysUntil);

        const stats = {
            totalFriends: allFriends.length,
            upcomingBirthdaysCount: upcomingBirthdays.length,
        };

        return NextResponse.json({
            upcomingBirthdays,
            stats,
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard data' },
            { status: 500 }
        );
    }
}
