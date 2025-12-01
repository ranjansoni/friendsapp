import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateFriendSchema = z.object({
    fullName: z.string().min(1, "Name is required").optional(),
    country: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    birthMonth: z.number().min(1).max(12).optional(),
    birthDay: z.number().min(1).max(31).optional(),
    birthYear: z.number().optional(),
    notes: z.string().optional(),
});

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const friend = await prisma.friend.findUnique({
            where: { id: params.id },
            include: {
                wishes: {
                    orderBy: { year: 'desc' },
                    take: 5,
                },
            },
        });

        if (!friend) {
            return NextResponse.json(
                { error: 'Friend not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(friend);
    } catch (error) {
        console.error('Error fetching friend:', error);
        return NextResponse.json(
            { error: 'Failed to fetch friend' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const validatedData = updateFriendSchema.parse(body);

        const friend = await prisma.friend.update({
            where: { id: params.id },
            data: validatedData,
        });

        return NextResponse.json(friend);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation failed', details: error.errors },
                { status: 400 }
            );
        }
        console.error('Error updating friend:', error);
        return NextResponse.json(
            { error: 'Failed to update friend' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.friend.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting friend:', error);
        return NextResponse.json(
            { error: 'Failed to delete friend' },
            { status: 500 }
        );
    }
}
