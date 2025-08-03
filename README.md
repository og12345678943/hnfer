# LinkUp - Professional Social Network Platform

A modern, responsive social networking platform built for professionals to connect, share ideas, and build meaningful relationships.

## 🚀 Live Demo

[View Live Demo](https://your-demo-url.com)

## 📱 Features

### ✅ User Authentication
- **Email & Password Registration/Login**: Secure authentication system
- **User Profiles**: Complete profile management with name, email, bio, and additional professional information
- **Profile Customization**: Users can edit their profiles, add bio, skills, location, company, education, and website

### ✅ Public Post Feed
- **Create Posts**: Share text-based thoughts and ideas (up to 500 characters)
- **Real-time Updates**: Posts appear instantly without page refresh using Firebase real-time listeners
- **Interactive Feed**: Home feed displays all posts with author information and timestamps
- **Post Management**: Users can delete their own posts

### ✅ Profile Pages
- **User Profiles**: View any user's profile with their information and post history
- **Personal Posts**: See all posts from a specific user
- **Follow System**: Follow/unfollow other users (with follower/following counts)
- **Professional Information**: Display skills, achievements, and professional details

### 🎨 Additional Features
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Interactions**: Like posts, add comments, and see updates instantly
- **Search Functionality**: Find users by name across the platform
- **Enhanced UI/UX**: Modern design with smooth animations and micro-interactions
- **Professional Networking**: Connect with other professionals in your field

## 🛠️ Tech Stack

### Frontend
- **Next.js 13** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

### Backend & Database
- **Firebase Authentication** - User authentication
- **Cloud Firestore** - NoSQL database for real-time data
- **Firebase Security Rules** - Database security

### Development Tools
- **TypeScript** - Type safety
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- Firebase project set up

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/linkup-social-platform.git
cd linkup-social-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Configuration
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Copy your Firebase config and update `firebase/config.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 4. Set up Firestore Security Rules
Copy the following rules to your Firestore Security Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - allow read for all, write for authenticated users on their own data
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Posts collection - allow read for all, write for authenticated users
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null && request.auth.uid == resource.data.authorId;
    }
    
    // Comments collection
    match /comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid == resource.data.authorId;
      allow delete: if request.auth != null && request.auth.uid == resource.data.authorId;
    }
  }
}
```

### 5. Create Required Firestore Indexes
In your Firebase Console, go to Firestore > Indexes and create:

1. **Posts Collection**:
   - Collection ID: `posts`
   - Fields: `createdAt` (Descending)

2. **Posts by Author**:
   - Collection ID: `posts`
   - Fields: `authorId` (Ascending), `createdAt` (Descending)

3. **Comments Collection**:
   - Collection ID: `comments`
   - Fields: `postId` (Ascending), `createdAt` (Ascending)

### 6. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Build for Production
```bash
npm run build
npm start
```

## 🏗️ Project Structure

```
linkup-social-platform/
├── components/           # Reusable UI components
│   ├── EnhancedNavbar.js
│   ├── EnhancedPostCard.js
│   ├── EnhancedProfileCard.js
│   ├── PostForm.js
│   └── FeedSidebar.js
├── contexts/            # React contexts
│   └── ThemeContext.js
├── firebase/            # Firebase configuration
│   └── config.js
├── pages/               # Next.js pages
│   ├── _app.js
│   ├── index.js
│   ├── login.js
│   ├── register.js
│   ├── create.js
│   ├── edit-profile.js
│   ├── search.js
│   ├── network.js
│   ├── jobs.js
│   ├── messages.js
│   └── profile/[id].js
├── utils/               # Utility functions
│   ├── auth.js
│   └── protectedRoute.js
├── app/                 # App configuration
│   ├── globals.css
│   └── layout.tsx
└── public/              # Static assets
```

## 🔐 Security Features

- **Authentication Required**: Protected routes require user authentication
- **Data Validation**: Client and server-side validation
- **Firestore Security Rules**: Database-level security
- **User Data Protection**: Users can only modify their own data

## 🌟 Key Features Explained

### Real-time Updates
The platform uses Firebase's real-time listeners to provide instant updates:
- New posts appear immediately in the feed
- Like counts update in real-time
- Comments are added instantly
- Profile changes reflect immediately

### Responsive Design
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interface
- Fast loading times

### Professional Networking
- User discovery and search
- Follow/unfollow system
- Professional profile information
- Skills and achievements display

## 🚀 Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy with default settings

### Deploy to Netlify
1. Build the project: `npm run build`
2. Deploy the `out` folder to [Netlify](https://netlify.com)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase for backend services
- Tailwind CSS for styling
- Lucide React for icons
- Next.js team for the amazing framework

## 📞 Support

If you have any questions or need help, please:
1. Check the [Issues](https://github.com/yourusername/linkup-social-platform/issues) page
2. Create a new issue if your problem isn't already listed
3. Contact the maintainers

---

**Built with ❤️ for the professional community**