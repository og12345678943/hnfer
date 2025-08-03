'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Trash2, Clock } from 'lucide-react';
import { useAuth } from '../utils/protectedRoute';
import { db } from '../firebase/config';
import { doc, updateDoc, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore';

export default function PostCard({ post, onPostDeleted }) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [likedBy, setLikedBy] = useState(post.likedBy || []);

  useEffect(() => {
    if (user && likedBy.includes(user.uid)) {
      setIsLiked(true);
    }
  }, [user, likedBy]);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const handleLike = async () => {
    if (!user) return;

    try {
      const postRef = doc(db, 'posts', post.id);
      
      if (isLiked) {
        // Unlike
        await updateDoc(postRef, {
          likes: Math.max(0, likesCount - 1),
          likedBy: arrayRemove(user.uid)
        });
        setIsLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
        setLikedBy(prev => prev.filter(uid => uid !== user.uid));
      } else {
        // Like
        await updateDoc(postRef, {
          likes: likesCount + 1,
          likedBy: arrayUnion(user.uid)
        });
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
        setLikedBy(prev => [...prev, user.uid]);
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleDelete = async () => {
    if (!user || post.authorId !== user.uid) return;
    
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteDoc(doc(db, 'posts', post.id));
        if (onPostDeleted) onPostDeleted(post.id);
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Link href={`/profile/${post.authorId}`}>
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
              <span className="text-white font-medium">
                {post.authorName?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </Link>
          <div>
            <Link 
              href={`/profile/${post.authorId}`}
              className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {post.authorName}
            </Link>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              {formatDate(post.createdAt)}
            </div>
          </div>
        </div>
        
        {user && post.authorId === user.uid && (
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={handleLike}
          disabled={!user}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            isLiked
              ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
              : 'text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
          } ${!user ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span className="font-medium">{likesCount}</span>
        </button>
      </div>
    </div>
  );
}