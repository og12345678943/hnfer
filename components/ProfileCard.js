'use client';

import Link from 'next/link';
import { Edit3, MapPin, Calendar } from 'lucide-react';

export default function ProfileCard({ userData, isOwnProfile, userId }) {
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Cover */}
      <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-800"></div>
      
      {/* Profile Info */}
      <div className="p-6 -mt-16 relative">
        <div className="flex items-end justify-between mb-4">
          <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-600">
              {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          
          {isOwnProfile && (
            <Link
              href="/edit-profile"
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </Link>
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {userData?.name || 'Anonymous User'}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400">
            {userData?.email}
          </p>
          
          {userData?.bio && (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {userData.bio}
            </p>
          )}
          
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 pt-2">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Joined {formatDate(userData?.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}