'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white';
    };

    return (
        <nav className="bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="text-white font-bold text-xl">🎂 Friends App</span>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link
                                    href="/"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/friends"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/friends')}`}
                                >
                                    All Friends
                                </Link>
                                <Link
                                    href="/friends/add"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/friends/add')}`}
                                >
                                    Add Friend
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link
                        href="/"
                        className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/')}`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/friends"
                        className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/friends')}`}
                    >
                        All Friends
                    </Link>
                    <Link
                        href="/friends/add"
                        className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/friends/add')}`}
                    >
                        Add Friend
                    </Link>
                </div>
            </div>
        </nav>
    );
}
