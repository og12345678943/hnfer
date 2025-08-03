'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, Users, Briefcase, Calendar, ExternalLink, ChevronRight, Hash, Siren as Fire } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, query, limit, getDocs } from 'firebase/firestore';

export default function FeedSidebar() {
  const [trendingTopics, setTrendingTopics] = useState([
    { tag: 'WebDevelopment', posts: 1234 },
    { tag: 'AI', posts: 987 },
    { tag: 'RemoteWork', posts: 756 },
    { tag: 'Startup', posts: 543 },
    { tag: 'Design', posts: 432 }
  ]);
  
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [upcomingEvents] = useState([
    {
      id: 1,
      title: 'Tech Conference 2024',
      date: '2024-02-15',
      attendees: 1200
    },
    {
      id: 2,
      title: 'Startup Networking',
      date: '2024-02-20',
      attendees: 350
    }
  ]);

  useEffect(() => {
    // Fetch suggested users
    const fetchSuggestedUsers = async () => {
      try {
        const q = query(collection(db, 'users'), limit(10));
        const snapshot = await getDocs(q);
        const users = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => {
            const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
            const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
            return bTime - aTime;
          })
          .slice(0, 5);
        setSuggestedUsers(users);
      } catch (error) {
        console.error('Error fetching suggested users:', error);
      }
    };

    fetchSuggestedUsers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Trending Topics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Fire className="w-5 h-5 text-orange-500 mr-2" />
            Trending
          </h3>
          <Link href="/trending" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
            See all
          </Link>
        </div>
        <div className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <Link
              key={topic.tag}
              href={`/search?q=${encodeURIComponent('#' + topic.tag)}`}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400 w-4">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    #{topic.tag}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {topic.posts.toLocaleString()} posts
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            </Link>
          ))}
        </div>
      </div>

      {/* Suggested Connections */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Users className="w-5 h-5 text-blue-500 mr-2" />
            People to Follow
          </h3>
          <Link href="/suggestions" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
            See all
          </Link>
        </div>
        <div className="space-y-4">
          {suggestedUsers.slice(0, 3).map(user => (
            <div key={user.id} className="flex items-center justify-between">
              <Link href={`/profile/${user.id}`} className="flex items-center space-x-3 flex-1">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {user.title || 'Professional'}
                  </p>
                </div>
              </Link>
              <button className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1 rounded-lg text-sm font-medium transition-colors">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Calendar className="w-5 h-5 text-green-500 mr-2" />
            Events
          </h3>
          <Link href="/events" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
            See all
          </Link>
        </div>
        <div className="space-y-4">
          {upcomingEvents.map(event => (
            <div key={event.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                {event.title}
              </h4>
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>{new Date(event.date).toLocaleDateString()}</span>
                <span>{event.attendees} attending</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Links
        </h3>
        <div className="space-y-3">
          <Link
            href="/jobs"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
          >
            <Briefcase className="w-5 h-5 text-purple-500" />
            <span className="text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">
              Browse Jobs
            </span>
          </Link>
          <Link
            href="/analytics"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
          >
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400">
              Analytics
            </span>
          </Link>
          <a
            href="https://help.linkup.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
          >
            <ExternalLink className="w-5 h-5 text-blue-500" />
            <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              Help Center
            </span>
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            © 2024 LinkUp. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 text-xs text-gray-400 dark:text-gray-500">
            <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400">
              Terms
            </Link>
            <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400">
              About
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}