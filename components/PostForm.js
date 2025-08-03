'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Send, Image, Video, FileText, Smile } from 'lucide-react';

export default function PostForm({ user, userData, onPostCreated }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const postData = {
        authorId: user.uid,
        authorName: userData?.name || 'Anonymous',
        content: content.trim(),
        createdAt: serverTimestamp(),
        likes: 0,
        likedBy: []
      };

      const docRef = await addDoc(collection(db, 'posts'), postData);
      
      setContent('');
      setShowOptions(false);
      if (onPostCreated) {
        onPostCreated({ ...postData, id: docRef.id, createdAt: new Date() });
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 hover:shadow-md transition-shadow">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white font-medium">
              {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts with the community..."
              rows={3}
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl resize-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              maxLength={500}
              onFocus={() => setShowOptions(true)}
            />
            
            {/* Post Options */}
            {showOptions && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Image className="w-5 h-5" />
                      <span className="text-sm font-medium">Photo</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    >
                      <Video className="w-5 h-5" />
                      <span className="text-sm font-medium">Video</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      <FileText className="w-5 h-5" />
                      <span className="text-sm font-medium">Document</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                    >
                      <Smile className="w-5 h-5" />
                      <span className="text-sm font-medium">Feeling</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center space-x-4">
                <span className={`text-sm ${
                  content.length > 450 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {content.length}/500
                </span>
                {content.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setContent('');
                      setShowOptions(false);
                    }}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-3">
                {showOptions && (
                  <button
                    type="button"
                    onClick={() => setShowOptions(false)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!content.trim() || isSubmitting}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Posting...' : 'Share'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}