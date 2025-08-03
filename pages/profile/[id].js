'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../firebase/config';
import { doc, getDoc, collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { useAuth } from '../../utils/protectedRoute';
import EnhancedProfileCard from '../../components/EnhancedProfileCard';
import EnhancedPostCard from '../../components/EnhancedPostCard';
import { MessageSquare } from 'lucide-react';

export default function Profile() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Check if this is the user's own profile
    if (user && user.uid === id) {
      setIsOwnProfile(true);
    }

    // Fetch user data
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', id));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          // User not found
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/');
      }
    };

    fetchUserData();

    // Set up real-time listener for user's posts
    const q = query(
      collection(db, 'posts'),
      where('authorId', '==', id),
      orderBy('createdAt', 'desc')
    );
    
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
  }, [id, user, router]);

  const handlePostDeleted = (postId) => {
    // The real-time listener will automatically update the posts
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            User not found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The profile you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <EnhancedProfileCard 
              userData={userData} 
              isOwnProfile={isOwnProfile}
              userId={id}
            />
          </div>
        </div>

        {/* Posts */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {isOwnProfile ? 'Your Posts' : `${userData.name}'s Posts`}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No posts yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {isOwnProfile 
                  ? "You haven't shared anything yet. Create your first post!"
                  : "This user hasn't shared anything yet."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map(post => (
                <EnhancedPostCard 
                  key={post.id} 
                  post={post} 
                  onPostDeleted={handlePostDeleted}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}