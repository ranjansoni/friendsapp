import Navigation from '@/components/Navigation';
import FriendForm from '@/components/FriendForm';

export default function AddFriendPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Friend</h1>
                    <div className="max-w-2xl mx-auto">
                        <FriendForm />
                    </div>
                </div>
            </main>
        </div>
    );
}
