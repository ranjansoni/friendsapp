'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import FriendForm from '@/components/FriendForm';
import { useRouter } from 'next/navigation';

export default function EditFriendPage({ params }: { params: { id: string } }) {
    const [friend, setFriend] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch(`/api/friends/${params.id}`)
            .then((res) => {
                if (!res.ok) throw new Error('Friend not found');
                return res.json();
            })
            .then((data) => {
                setFriend(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                router.push('/friends');
            });
    }, [params.id, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation />
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="text-center py-12">Loading...</div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Friend</h1>
                    <div className="max-w-2xl mx-auto">
                        <FriendForm initialData={friend} isEditing={true} />
                    </div>
                </div>
            </main>
        </div>
    );
}
