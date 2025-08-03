'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  Edit3, MapPin, Calendar, Briefcase, GraduationCap, 
  Users, MessageCircle, UserPlus, UserCheck, ExternalLink,
  Award, Star, TrendingUp
} from 'lucide-react';
import { db } from '../firebase/config';
import { doc, updateDoc, arrayUnion, arrayRemove, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../utils/protectedRoute';

export default function EnhancedProfileCard({ userData, isOwnProfile, userId }) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(userData?.followers?.length || 0);
  const [followingCount, setFollowingCount] = useState(userData?.following?.length || 0);
  const [postsCount, setPostsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && userData?.followers) {
      setIsFollowing(userData.followers.includes(user.uid));
    }
  }, [user, userData]);

  useEffect(() => {
    const getPostsCount = async () => {
      try {
        const q = query(
          collection(db, 'posts'), 
          where('authorId', '==', userId)
        );
        const snapshot = await getDocs(q);
        setPostsCount(snapshot.size);
      } catch (error) {
        console.error('Error getting posts count:', error);
        setPostsCount(0);
      }
    };

    if (userId) {
      getPostsCount();
    }
  }, [userId]);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const handleFollow = async () => {
    if (!user || isOwnProfile) return;
    
    setIsLoading(true);
    try {
      const userRef = doc(db, 'users', userId);
      const currentUserRef = doc(db, 'users', user.uid);
      
      if (isFollowing) {
        // Unfollow
        await updateDoc(userRef, {
          followers: arrayRemove(user.uid)
        });
        await updateDoc(currentUserRef, {
          following: arrayRemove(userId)
        });
        setIsFollowing(false);
        setFollowersCount(prev => Math.max(0, prev - 1));
      } else {
        // Follow
        await updateDoc(userRef, {
          followers: arrayUnion(user.uid)
        });
        await updateDoc(currentUserRef, {
          following: arrayUnion(userId)
        });
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Cover Image */}
      <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative">
        <div className="absolute inset-0 bg-black/20"></div>
        {isOwnProfile && (
          <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
            <Edit3 className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Profile Info */}
      <div className="p-6 -mt-16 relative">
        <div className="flex items-end justify-between mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-blue-600">
                {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>
          
          <div className="flex items-center space-x-3">
            {!isOwnProfile && user && (
              <>
                <button
                  onClick={handleFollow}
                  disabled={isLoading}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isFollowing
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                  }`}
                >
                  {isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  <span>{isFollowing ? 'Following' : 'Follow'}</span>
                </button>
                <button className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium">
                  <MessageCircle className="w-4 h-4" />
                  <span>Message</span>
                </button>
              </>
            )}
            
            {isOwnProfile && (
              <Link
                href="/edit-profile"
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </Link>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {userData?.name || 'Anonymous User'}
            </h1>
            <p className="text-blue-600 dark:text-blue-400 font-medium">
              {userData?.title || 'Professional'}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {userData?.email}
            </p>
          </div>
          
          {userData?.bio && (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {userData.bio}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center space-x-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900 dark:text-white">{postsCount}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900 dark:text-white">{followersCount}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900 dark:text-white">{followingCount}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Following</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            {userData?.location && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{userData.location}</span>
              </div>
            )}
            
            {userData?.company && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Briefcase className="w-4 h-4 mr-2" />
                <span>{userData.company}</span>
              </div>
            )}
            
            {userData?.education && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <GraduationCap className="w-4 h-4 mr-2" />
                <span>{userData.education}</span>
              </div>
            )}
            
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Joined {formatDate(userData?.createdAt)}</span>
            </div>

            {userData?.website && (
              <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                <ExternalLink className="w-4 h-4 mr-2" />
                <a 
                  href={userData.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {userData.website}
                </a>
              </div>
            )}
          </div>

          {/* Skills/Badges */}
          {userData?.skills && userData.skills.length > 0 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {userData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Achievements</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-1" />
                <p className="text-xs font-medium text-yellow-800 dark:text-yellow-300">Top Contributor</p>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Star className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                <p className="text-xs font-medium text-purple-800 dark:text-purple-300">Rising Star</p>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-1" />
                <p className="text-xs font-medium text-green-800 dark:text-green-300">Influencer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}