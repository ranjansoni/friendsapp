'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import FriendCard from '@/components/FriendCard';
import Link from 'next/link';

export default function FriendsList() {
    const [friends, setFriends] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('/api/friends')
            .then((res) => res.json())
            .then((data) => {
                setFriends(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const filteredFriends = friends.filter(friend =>
        friend.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.country?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">All Friends</h1>
                        <Link
                            href="/friends/add"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Add Friend
                        </Link>
                    </div>

                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search friends..."
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-3"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {loading ? (
                        <div className="text-center py-12">Loading...</div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredFriends.map((friend) => (
                                <FriendCard key={friend.id} friend={friend} />
                            ))}
                        </div>
                    )}

                    {!loading && filteredFriends.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No friends found.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
