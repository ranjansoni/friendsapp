'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const friendSchema = z.object({
    fullName: z.string().min(1, "Name is required"),
    country: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email("Invalid email").optional().or(z.literal('')),
    birthMonth: z.number().min(1).max(12),
    birthDay: z.number().min(1).max(31),
    birthYear: z.preprocess(
        (val) => (val === '' || val === null || Number.isNaN(val) ? undefined : Number(val)),
        z.number().optional()
    ),
    notes: z.string().optional(),
});

type FriendFormData = z.infer<typeof friendSchema>;

interface FriendFormProps {
    initialData?: FriendFormData & { id?: string };
    isEditing?: boolean;
}

export default function FriendForm({ initialData, isEditing = false }: FriendFormProps) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FriendFormData>({
        resolver: zodResolver(friendSchema),
        defaultValues: initialData || {
            birthMonth: new Date().getMonth() + 1,
            birthDay: new Date().getDate(),
        },
    });

    const onSubmit = async (data: FriendFormData) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const url = isEditing && initialData?.id
                ? `/api/friends/${initialData.id}`
                : '/api/friends';

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to save friend');
            }

            router.push('/friends');
            router.refresh();
        } catch (err) {
            setError('An error occurred while saving. Please try again.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                    {...register('fullName')}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
                {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        {...register('email')}
                        type="email"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                        {...register('phone')}
                        type="tel"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <input
                    {...register('country')}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Month</label>
                    <select
                        {...register('birthMonth', { valueAsNumber: true })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                            <option key={m} value={m}>
                                {new Date(0, m - 1).toLocaleString('default', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Day</label>
                    <input
                        {...register('birthDay', { valueAsNumber: true })}
                        type="number"
                        min="1"
                        max="31"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                    {errors.birthDay && (
                        <p className="mt-1 text-sm text-red-600">{errors.birthDay.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Year (Optional)</label>
                    <input
                        {...register('birthYear', { valueAsNumber: true })}
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                    {...register('notes')}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {isSubmitting ? 'Saving...' : 'Save Friend'}
                </button>
            </div>
        </form>
    );
}
