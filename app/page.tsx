'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

interface DashboardData {
    upcomingBirthdays: any[];
    stats: {
        totalFriends: number;
        upcomingBirthdaysCount: number;
    };
}

export default function Home() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dashboard')
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

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
                <div className="px-4 py-6 sm:px-0">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Friends</dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">{data?.stats.totalFriends || 0}</dd>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Birthdays (30 Days)</dt>
                                <dd className="mt-1 text-3xl font-semibold text-indigo-600">{data?.stats.upcomingBirthdaysCount || 0}</dd>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Birthdays List */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Upcoming Birthdays
                            </h3>
                        </div>
                        <ul className="divide-y divide-gray-200">
                            {data?.upcomingBirthdays.length === 0 ? (
                                <li className="px-4 py-4 sm:px-6 text-gray-500 text-center">
                                    No upcoming birthdays in the next 30 days.
                                </li>
                            ) : (
                                data?.upcomingBirthdays.map((friend: any) => (
                                    <li key={friend.id}>
                                        <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-medium text-indigo-600 truncate">
                                                        {friend.fullName}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(friend.nextBirthday).toLocaleDateString(undefined, {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${friend.daysUntil === 0
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {friend.daysUntil === 0 ? 'Today!' : `In ${friend.daysUntil} days`}
                                                    </span>
                                                    {friend.age && (
                                                        <span className="text-xs text-gray-500 mt-1">
                                                            Turning {friend.age}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <Link
                            href="/friends/add"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Add New Friend
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
