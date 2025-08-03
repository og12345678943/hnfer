'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { db } from '../firebase/config';
import { collection, query, getDocs, limit } from 'firebase/firestore';
import { Search, User, Users } from 'lucide-react';

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (q) {
      setSearchQuery(q);
      performSearch(q);
    }
  }, [q]);

  const performSearch = async (searchTerm) => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      // Search for users by name
      const usersRef = collection(db, 'users');
      const q1 = query(usersRef, limit(50));

      const snapshot = await getDocs(q1);
      const allUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter users by name in JavaScript (case-insensitive)
      const filteredUsers = allUsers.filter(user => 
        user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setSearchResults(filteredUsers.slice(0, 20));
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="text-center mb-8">
        <Search className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Search Users
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find and connect with professionals in the community
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for users by name..."
            className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Search Results */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : q && searchResults.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No users found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              No users found matching "{q}". Try a different search term.
            </p>
          </div>
        ) : searchResults.length > 0 ? (
          <div>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Search Results for "{q}"
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {searchResults.length} {searchResults.length === 1 ? 'user' : 'users'} found
              </p>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {searchResults.map(user => (
                <Link
                  key={user.id}
                  href={`/profile/${user.id}`}
                  className="block p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {user.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {user.email}
                      </p>
                      {user.bio && (
                        <p className="text-gray-500 dark:text-gray-500 text-sm mt-1 line-clamp-2">
                          {user.bio}
                        </p>
                      )}
                    </div>
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Start Searching
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enter a name in the search box above to find users
            </p>
          </div>
        )}
      </div>
    </div>
  );
}