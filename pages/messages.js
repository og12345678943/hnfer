'use client';

import { useState } from 'react';
import { withAuth } from '../utils/protectedRoute';
import { 
  MessageCircle, Search, Send, Phone, Video, 
  MoreHorizontal, Paperclip, Smile, Users 
} from 'lucide-react';

function Messages({ user }) {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock conversations data
  const [conversations] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      lastMessage: 'Thanks for connecting! Looking forward to collaborating.',
      timestamp: '2 min ago',
      unread: 2,
      online: true,
      avatar: 'SJ'
    },
    {
      id: 2,
      name: 'Tech Team',
      lastMessage: 'Meeting scheduled for tomorrow at 2 PM',
      timestamp: '1 hour ago',
      unread: 0,
      online: false,
      avatar: 'TT',
      isGroup: true
    },
    {
      id: 3,
      name: 'Mike Chen',
      lastMessage: 'Great presentation today!',
      timestamp: '3 hours ago',
      unread: 1,
      online: true,
      avatar: 'MC'
    },
    {
      id: 4,
      name: 'Design Team',
      lastMessage: 'New mockups are ready for review',
      timestamp: '1 day ago',
      unread: 0,
      online: false,
      avatar: 'DT',
      isGroup: true
    }
  ]);

  // Mock messages for selected chat
  const [messages] = useState({
    1: [
      {
        id: 1,
        sender: 'Sarah Johnson',
        content: 'Hi! I saw your post about the new project. Very interesting approach!',
        timestamp: '10:30 AM',
        isOwn: false
      },
      {
        id: 2,
        sender: 'You',
        content: 'Thank you! I\'d love to discuss it further. Are you available for a quick call?',
        timestamp: '10:32 AM',
        isOwn: true
      },
      {
        id: 3,
        sender: 'Sarah Johnson',
        content: 'Absolutely! How about tomorrow at 2 PM?',
        timestamp: '10:35 AM',
        isOwn: false
      },
      {
        id: 4,
        sender: 'You',
        content: 'Perfect! I\'ll send you a calendar invite.',
        timestamp: '10:36 AM',
        isOwn: true
      },
      {
        id: 5,
        sender: 'Sarah Johnson',
        content: 'Thanks for connecting! Looking forward to collaborating.',
        timestamp: '2 min ago',
        isOwn: false
      }
    ]
  });

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;
    
    // In a real app, this would send the message to the backend
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden h-[calc(100vh-12rem)]">
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Messages
              </h1>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map(conversation => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedChat(conversation)}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    selectedChat?.id === conversation.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-medium text-white ${
                        conversation.isGroup ? 'bg-purple-600' : 'bg-blue-600'
                      }`}>
                        {conversation.isGroup ? (
                          <Users className="w-6 h-6" />
                        ) : (
                          conversation.avatar
                        )}
                      </div>
                      {conversation.online && !conversation.isGroup && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {conversation.name}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {conversation.timestamp}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unread > 0 && (
                          <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-white ${
                          selectedChat.isGroup ? 'bg-purple-600' : 'bg-blue-600'
                        }`}>
                          {selectedChat.isGroup ? (
                            <Users className="w-5 h-5" />
                          ) : (
                            selectedChat.avatar
                          )}
                        </div>
                        {selectedChat.online && !selectedChat.isGroup && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                        )}
                      </div>
                      <div>
                        <h2 className="font-semibold text-gray-900 dark:text-white">
                          {selectedChat.name}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedChat.online && !selectedChat.isGroup ? 'Online' : 'Last seen recently'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Phone className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Video className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages[selectedChat.id]?.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isOwn
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.isOwn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <button
                      type="button"
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <Smile className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              /* No Chat Selected */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Messages);