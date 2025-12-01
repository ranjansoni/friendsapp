'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Friend {
    id: string;
    fullName: string;
    country?: string | null;
    birthMonth: number;
    birthDay: number;
    birthYear?: number | null;
    email?: string | null;
    phone?: string | null;
}

interface FriendCardProps {
    friend: Friend;
}

export default function FriendCard({ friend }: FriendCardProps) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this friend?')) return;

        try {
            const response = await fetch(`/api/friends/${friend.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.refresh();
            } else {
                alert('Failed to delete friend');
            }
        } catch (error) {
            console.error('Error deleting friend:', error);
            alert('Error deleting friend');
        }
    };

    const birthDate = new Date(0, friend.birthMonth - 1, friend.birthDay);
    const birthString = birthDate.toLocaleDateString('default', { month: 'long', day: 'numeric' });

    return (
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            {friend.fullName}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            🎂 {birthString} {friend.birthYear ? `(${friend.birthYear})` : ''}
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <Link
                            href={`/friends/${friend.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                            Delete
                        </button>
                    </div>
                </div>

                <div className="mt-4 space-y-2">
                    {friend.country && (
                        <p className="text-sm text-gray-600 flex items-center">
                            <span className="mr-2">📍</span> {friend.country}
                        </p>
                    )}
                    {friend.email && (
                        <p className="text-sm text-gray-600 flex items-center">
                            <span className="mr-2">📧</span> {friend.email}
                        </p>
                    )}
                    {friend.phone && (
                        <p className="text-sm text-gray-600 flex items-center">
                            <span className="mr-2">📱</span> {friend.phone}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
