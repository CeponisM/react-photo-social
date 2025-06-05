# Instagram Clone

A modern Instagram-inspired social media application built with React and Firebase, featuring real-time posting, image editing, and social interactions.

## Features

- **User Authentication**: Secure sign-up and sign-in with Firebase Auth
- **Create Posts**: Upload images with captions and share with followers
- **Image Editing**: Built-in image editor with crop, filter, and drawing tools
- **Social Interactions**: Like and comment on posts
- **Real-time Updates**: Live feed updates using Firestore
- **Profile Management**: User profiles with display names and photos
- **Follow System**: Follow and unfollow other users
- **Responsive Design**: Mobile-friendly interface with bottom navigation
- **Post Management**: Delete your own posts with confirmation modals

## Tech Stack

- **Frontend**: React 18, Framer Motion for animations
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Image Processing**: TOAST UI Image Editor
- **Routing**: React Router DOM
- **Styling**: CSS with responsive design
- **File Upload**: React Dropzone with drag-and-drop support

## Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- npm or yarn package manager
- Firebase project with Firestore, Authentication, and Storage enabled

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CeponisM/react-photo-social.git
   cd instagram-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password provider)
   - Create a Firestore database
   - Enable Firebase Storage
   - Copy your Firebase configuration

4. **Environment Configuration**
   
   Create a `src/firebase.js` file with your Firebase configuration:
   ```javascript
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';
   import { getFirestore } from 'firebase/firestore';
   import { getStorage } from 'firebase/storage';

   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-auth-domain",
     projectId: "your-project-id",
     storageBucket: "your-storage-bucket",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id"
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   export const db = getFirestore(app);
   export const storage = getStorage(app);
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

   The application will open at `http://localhost:3000`

## Firestore Database Structure

```
users/
  {userId}/
    - displayName
    - photoURL
    - email

Posts/
  {postId}/
    - userId
    - username
    - caption
    - imageUrl
    - timestamp
    
    comments/
      {commentId}/
        - userId
        - text
        - timestamp
    
    likes/
      {likeId}/
        - userId

follows/
  {userId}/
    userFollows/
      {followedUserId}/
        - (empty document indicating follow relationship)
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (irreversible)

## Key Features Explained

### Image Upload & Editing
- Drag-and-drop or click to browse for images
- Built-in image editor with tools for:
  - Cropping and rotating
  - Filters and effects
  - Drawing and text overlay
  - Shape and icon insertion

### Authentication Flow
- New users can sign up with email/password
- Existing users sign in with credentials
- User profile data is stored in Firestore
- Protected routes require authentication

### Real-time Social Features
- Posts appear in feed immediately after creation
- Like counts update in real-time
- Comments are displayed chronologically
- Follow relationships tracked in Firestore

### Security Features
- Firebase Storage rules ensure users can only delete their own images
- Firestore security rules protect user data
- Image metadata includes owner information
- Post deletion restricted to post owners

## Deployment

### Firebase Hosting (Recommended)

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Build the project**
   ```bash
   npm run build
   ```

3. **Initialize Firebase Hosting**
   ```bash
   firebase init hosting
   ```

4. **Deploy**
   ```bash
   firebase deploy
   ```

### Other Platforms
The built application can be deployed to any static hosting service like Netlify, Vercel, or AWS S3.

## Troubleshooting

### Common Issues

**Firebase Configuration Errors**
- Ensure all Firebase services (Auth, Firestore, Storage) are enabled
- Check that API keys and project IDs are correct
- Verify Firebase rules allow read/write operations

**Image Upload Issues**
- Check Firebase Storage rules
- Ensure storage bucket exists and is accessible
- Verify file size limits

**Authentication Problems**
- Enable Email/Password provider in Firebase Console
- Check that auth domain is configured correctly

## Performance Considerations

- Images are stored in Firebase Storage with unique naming
- Firestore queries are optimized with indexing
- Components use React.memo() where appropriate
- Large images are handled efficiently with blob conversion

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

Note: Image editing features work best in modern browsers with full Canvas API support.