'use client';

import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { useAuth } from '../utils/protectedRoute';
import { getUserData } from '../utils/auth';
import EnhancedPostCard from '../components/EnhancedPostCard';
import PostForm from '../components/PostForm';
import FeedSidebar from '../components/FeedSidebar';
import { Users, TrendingUp, MessageSquare } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getUserData(user.uid).then(setUserData);
    }
  }, [user]);

  useEffect(() => {
    // Set up real-time listener for posts
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      try {
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setPosts(postsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handlePostCreated = (newPost) => {
    // The real-time listener will automatically update the posts
    // This is just for immediate UI feedback if needed
  };

  const handlePostDeleted = (postId) => {
    // The real-time listener will automatically update the posts
    // This is just for immediate UI feedback if needed
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      {!user && (
        <div className="text-center mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-12 shadow-lg border border-gray-200 dark:border-gray-700">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to LinkUp
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Connect with professionals, share your thoughts, and build meaningful relationships
          </p>
          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Professional Network</span>
            </div>
            <div className="text-center">
              <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Share Ideas</span>
            </div>
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Grow Together</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-3">
          {/* Post Form */}
          {user && userData && (
            <PostForm user={user} userData={userData} onPostCreated={handlePostCreated} />
          )}

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {user ? 'Be the first to share something!' : 'Join LinkUp to see posts from the community.'}
                </p>
              </div>
            ) : (
              posts.map(post => (
                <EnhancedPostCard 
                  key={post.id} 
                  post={post} 
                  onPostDeleted={handlePostDeleted}
                />
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <FeedSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}