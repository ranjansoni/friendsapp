import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema for creating a friend
const createFriendSchema = z.object({
    fullName: z.string().min(1, "Name is required"),
    country: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    birthMonth: z.number().min(1).max(12),
    birthDay: z.number().min(1).max(31),
    birthYear: z.number().optional(),
    notes: z.string().optional(),
});

export async function GET() {
    try {
        const friends = await prisma.friend.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return NextResponse.json(friends);
    } catch (error) {
        console.error('Error fetching friends:', error);
        return NextResponse.json(
            { error: 'Failed to fetch friends' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = createFriendSchema.parse(body);

        const friend = await prisma.friend.create({
            data: validatedData,
        });

        return NextResponse.json(friend, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation failed', details: error.errors },
                { status: 400 }
            );
        }
        console.error('Error creating friend:', error);
        return NextResponse.json(
            { error: 'Failed to create friend' },
            { status: 500 }
        );
    }
}
