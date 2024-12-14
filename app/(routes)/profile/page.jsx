'use client'
import { useUser, useClerk } from "@clerk/nextjs";
import Image from "next/image";
import GlobalApi from '@/app/_services/GlobalApi';
import { useEffect, useState } from "react";

function ProfilePage() {
    const { user } = useUser();
    const { openUserProfile } = useClerk();
    const [bookingsCount, setBookingsCount] = useState(0);
    const [reviewsCount, setReviewsCount] = useState(0);
    useEffect(() => {
        if (user?.primaryEmailAddress?.emailAddress) {
            // Fetch booking history
            GlobalApi.GetUserBookingHistory(user.primaryEmailAddress.emailAddress)
                .then(result => {
                    setBookingsCount(result.bookings?.length || 0);
                })
                .catch(error => console.error("Error fetching bookings:", error));

            // Get client ID and then fetch reviews count
            GlobalApi.getClientByEmail(user.primaryEmailAddress.emailAddress)
                .then(clientId => {
                    if (clientId) {
                        // You'll need to add a method to get reviews count by client ID
                        // This is a placeholder assuming you'll add this method
                        GlobalApi.getClientReviewsCount(clientId)
                            .then(count => setReviewsCount(count))
                            .catch(error => console.error("Error fetching reviews:", error));
                    }
                })
                .catch(error => console.error("Error fetching client:", error));
        }
    }, [user]);
    return (
        <div className="max-w-6xl mx-auto p-5 mt-10">
            {/* Main Profile Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header Banner */}
                <div className="h-32 bg-gradient-to-r from-primary to-orange-100"></div>

                {/* Profile Content */}
                <div className="relative px-6 pb-6">
                    {/* Profile Image with Edit Button */}
                    <div className="relative -mt-16 mb-4">
                        <div className="relative w-32 h-32 mx-auto">
                            <div className="relative w-32 h-32 ring-4 ring-white rounded-full">
                                <Image
                                    src={user?.imageUrl || '/default-avatar.png'}
                                    alt="Profile"
                                    fill
                                    className="rounded-full object-cover"
                                />
                            </div>
                            {/* Edit Button */}
                            <button
                                onClick={() => openUserProfile()}
                                className="absolute bottom-0 right-0 bg-primary hover:bg-orange-200 text-white p-2 rounded-full shadow-lg transition-colors duration-200"
                                title="Edit Profile Picture"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            {user?.fullName}
                        </h1>
                        <p className="text-gray-600">
                            {user?.primaryEmailAddress?.emailAddress}
                        </p>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <p className="text-2xl font-bold text-primary">{bookingsCount}</p>
                            <p className="text-gray-600">Bookings</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <p className="text-2xl font-bold text-primary">{reviewsCount}</p>
                            <p className="text-gray-600">Reviews</p>
                        </div>

                    </div>

                    {/* Profile Information */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Profile Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-500">First Name</label>
                                <p className="text-gray-800 font-medium p-3 bg-gray-50 rounded-lg">
                                    {user?.firstName}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-500">Last Name</label>
                                <p className="text-gray-800 font-medium p-3 bg-gray-50 rounded-lg">
                                    {user?.lastName}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-500">Email</label>
                                <p className="text-gray-800 font-medium p-3 bg-gray-50 rounded-lg">
                                    {user?.primaryEmailAddress?.emailAddress}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-500">Member Since</label>
                                <p className="text-gray-800 font-medium p-3 bg-gray-50 rounded-lg">
                                    {new Date(user?.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;