'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Search, Plus, User, LogOut, Moon, Sun, Home, Bell, 
  MessageCircle, Users, Briefcase, Settings, ChevronDown,
  Menu, X
} from 'lucide-react';
import { useAuth } from '../utils/protectedRoute';
import { logoutUser, getUserData } from '../utils/auth';
import { useTheme } from '../contexts/ThemeContext';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, limit, getDocs } from 'firebase/firestore';

export default function EnhancedNavbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    if (user) {
      getUserData(user.uid).then(setUserData);
      
      // Listen for notifications (likes on user's posts)
      const fetchNotifications = async () => {
        try {
          const q = query(
            collection(db, 'posts'),
            where('authorId', '==', user.uid),
            limit(10)
          );
          
          const snapshot = await getDocs(q);
          const userPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const recentLikes = userPosts.filter(post => 
            post.likedBy && post.likedBy.length > 0 && 
            post.createdAt && new Date() - (post.createdAt.toDate?.() || new Date(post.createdAt)) < 24 * 60 * 60 * 1000
          );
          setNotifications(recentLikes.slice(0, 5));
        } catch (error) {
          console.error('Error fetching notifications:', error);
          setNotifications([]);
        }
      };

      fetchNotifications();
    }
  }, [user]);

  // Search functionality
  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.trim().length > 1) {
        try {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, limit(20));
          
          const snapshot = await getDocs(q);
          const allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          // Filter users by name in JavaScript
          const filteredUsers = allUsers.filter(user => 
            user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          
          setSearchResults(filteredUsers.slice(0, 5));
          setShowSearchResults(true);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    router.push('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
    }
  };

  const navigationItems = [
    { icon: Home, label: 'Home', href: '/', active: router.pathname === '/' },
    { icon: Users, label: 'Network', href: '/network', active: router.pathname === '/network' },
    { icon: Briefcase, label: 'Jobs', href: '/jobs', active: router.pathname === '/jobs' },
    { icon: MessageCircle, label: 'Messages', href: '/messages', active: router.pathname === '/messages' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 backdrop-blur-md bg-white/95 dark:bg-gray-900/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              LinkUp
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search professionals..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </form>
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                {searchResults.map(user => (
                  <Link
                    key={user.id}
                    href={`/profile/${user.id}`}
                    className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setShowSearchResults(false)}
                  >
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-medium text-sm">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center px-3 py-2 rounded-lg transition-colors ${
                  item.active
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Right Side Items */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {user ? (
              <>
                {/* Create Post Button */}
                <Link
                  href="/create"
                  className="hidden sm:flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post</span>
                </Link>

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                      </div>
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                          No new notifications
                        </div>
                      ) : (
                        notifications.map((notification, index) => (
                          <div key={index} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <p className="text-sm text-gray-900 dark:text-white">
                              Your post received {notification.likes} new likes
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {new Date(notification.createdAt?.toDate()).toLocaleDateString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-medium">
                        {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 hidden sm:block" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-medium text-gray-900 dark:text-white">{userData?.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{userData?.email}</p>
                      </div>
                      <Link
                        href={`/profile/${user.uid}`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        View Profile
                      </Link>
                      <Link
                        href="/edit-profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </Link>
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-sm"
                >
                  Join Now
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search professionals..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </form>
            </div>

            {/* Mobile Navigation */}
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    item.active
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              {user && (
                <Link
                  href="/create"
                  className="flex items-center px-3 py-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Plus className="w-5 h-5 mr-3" />
                  <span className="font-medium">Create Post</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}