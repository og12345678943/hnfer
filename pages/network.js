'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { withAuth } from '../utils/protectedRoute';
import { db } from '../firebase/config';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { Users, UserPlus, Search, Filter, TrendingUp } from 'lucide-react';

function Network({ user }) {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchSuggestedUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = suggestedUsers.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(suggestedUsers);
    }
  }, [searchQuery, suggestedUsers]);

  const fetchSuggestedUsers = async () => {
    try {
      const q = query(collection(db, 'users'), limit(20));
      const snapshot = await getDocs(q);
      const users = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u => u.uid !== user.uid); // Filter out current user in JavaScript
      setSuggestedUsers(users);
      setFilteredUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { id: 'all', label: 'All People', icon: Users },
    { id: 'recent', label: 'Recently Joined', icon: TrendingUp },
    { id: 'suggested', label: 'Suggested', icon: UserPlus }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <Users className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Grow Your Network
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Connect with professionals and expand your opportunities
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search people..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-2">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <filter.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{filter.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(suggestedUser => (
          <div
            key={suggestedUser.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">
                  {suggestedUser.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {suggestedUser.name}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                {suggestedUser.title || 'Professional'}
              </p>
              
              <p className="text-gray-500 dark:text-gray-500 text-sm mb-4">
                {suggestedUser.email}
              </p>
              
              {suggestedUser.bio && (
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {suggestedUser.bio}
                </p>
              )}
              
              <div className="flex space-x-3">
                <Link
                  href={`/profile/${suggestedUser.id}`}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-center"
                >
                  View Profile
                </Link>
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Connect
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No people found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}

export default withAuth(Network);