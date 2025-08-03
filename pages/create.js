'use client';

import { useState, useEffect } from 'react';
import { withAuth } from '../utils/protectedRoute';
import { getUserData } from '../utils/auth';
import PostForm from '../components/PostForm';
import { FileText, Users, TrendingUp } from 'lucide-react';

function CreatePost({ user }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user) {
      getUserData(user.uid).then(setUserData);
    }
  }, [user]);

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Share Your Thoughts
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          What would you like to share with the community today?
        </p>
      </div>

      <PostForm user={user} userData={userData} />

      {/* Tips */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tips for Great Posts
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Be Authentic</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Share genuine thoughts and experiences
            </p>
          </div>
          <div className="text-center">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Add Value</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Provide insights that help others
            </p>
          </div>
          <div className="text-center">
            <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Stay Professional</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Maintain a respectful and professional tone
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(CreatePost);