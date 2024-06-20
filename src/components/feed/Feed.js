import React, { useState, useEffect } from 'react';
import './Feed.css';
import Post from '../post/Post';
import NewPost from '../newPost/NewPost';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { auth, db, storage } from '../../firebase'; // Import auth, db, and storage
import { motion } from 'framer-motion';

function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDocs(query(collection(db, 'Posts'), orderBy('timestamp', 'desc')));
      const fetchedPosts = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      console.log('Fetched posts:', fetchedPosts); // Add this line
      setPosts(fetchedPosts);
    };

    fetchData();
  }, []);

  const newPost = async (caption, imageUrl, userId) => {
    const user = auth.currentUser;

    if (user) {
      try {
        // Add the new post to Firestore 'posts' collection
        const postDocRef = await addDoc(collection(db, 'Posts'), {
          userId: userId,
          username: user.displayName,
          caption,
          imageUrl,
          timestamp: serverTimestamp(),
        });

        // Get the newly generated post ID
        const newPostId = postDocRef.id;

        // Update the 'posts' state with the new post data
        setPosts((prevPosts) => [
          {
            id: newPostId,
            userId: user.uid,
            username: user.displayName,
            caption,
            imageUrl,
            timestamp: new Date(),
          },
          ...prevPosts
        ]);

        console.log('New post added successfully with ID:', newPostId);
      } catch (error) {
        console.error('Error adding new post:', error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="feed">
        <NewPost onNewPost={newPost} />
        {posts.map((post) => (
          <Post
            key={post.id}
            setPosts={setPosts}
            posts={posts}
            username={post.username}
            userId={post.userId}
            imageUrl={post.imageUrl}
            caption={post.caption}
            postId={post.id}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default Feed;