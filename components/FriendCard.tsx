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

// Function to get zodiac sign based on month and day
function getZodiacSign(month: number, day: number): string {
    const zodiacSigns = [
        { sign: '♑', name: 'Capricorn', emoji: '♑️' },    // Dec 22 - Jan 19
        { sign: '♒', name: 'Aquarius', emoji: '♒️' },     // Jan 20 - Feb 18
        { sign: '♓', name: 'Pisces', emoji: '♓️' },       // Feb 19 - Mar 20
        { sign: '♈', name: 'Aries', emoji: '♈️' },        // Mar 21 - Apr 19
        { sign: '♉', name: 'Taurus', emoji: '♉️' },       // Apr 20 - May 20
        { sign: '♊', name: 'Gemini', emoji: '♊️' },       // May 21 - Jun 20
        { sign: '♋', name: 'Cancer', emoji: '♋️' },       // Jun 21 - Jul 22
        { sign: '♌', name: 'Leo', emoji: '♌️' },          // Jul 23 - Aug 22
        { sign: '♍', name: 'Virgo', emoji: '♍️' },        // Aug 23 - Sep 22
        { sign: '♎', name: 'Libra', emoji: '♎️' },        // Sep 23 - Oct 22
        { sign: '♏', name: 'Scorpio', emoji: '♏️' },      // Oct 23 - Nov 21
        { sign: '♐', name: 'Sagittarius', emoji: '♐️' },  // Nov 22 - Dec 21
    ];

    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return zodiacSigns[0].emoji;
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return zodiacSigns[1].emoji;
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return zodiacSigns[2].emoji;
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return zodiacSigns[3].emoji;
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return zodiacSigns[4].emoji;
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return zodiacSigns[5].emoji;
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return zodiacSigns[6].emoji;
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return zodiacSigns[7].emoji;
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return zodiacSigns[8].emoji;
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return zodiacSigns[9].emoji;
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return zodiacSigns[10].emoji;
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return zodiacSigns[11].emoji;

    return '♑️'; // Default to Capricorn
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
    const zodiacSign = getZodiacSign(friend.birthMonth, friend.birthDay);

    return (
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                {friend.fullName}
                            </h3>
                            <span className="text-2xl" title="Zodiac Sign">{zodiacSign}</span>
                        </div>
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
