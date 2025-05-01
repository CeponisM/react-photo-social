import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import FollowButton from '../followButton/FollowButton';
import { motion } from 'framer-motion';
import { auth, db } from '../../firebase'; // Import auth and db

function Profile(props) {
  const [posts, setPosts] = useState([]);

  // Get a reference to the Firestore database
  const db = getFirestore();

  useEffect(() => {
    // Fetch user's posts from the database when the component mounts
    const postsQuery = query(collection(db, 'posts'), where('userId', '==', props.user.uid));
    const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
      const posts = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setPosts(posts);
    });

    return unsubscribe;
  }, [db, props.user.uid]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h2>{props.user}'s Profile</h2>
        <FollowButton isFollowing={props.isFollowing} onFollow={props.onFollow} />
        {posts.map((post) => (
          <div key={post.id}>
            <img src={post.imageUrl} alt="post" />
            <p>{post.caption}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default Profile;
