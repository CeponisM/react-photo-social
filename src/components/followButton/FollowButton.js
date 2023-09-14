import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { auth, db } from './firebase'; // Import auth and db

function FollowButton(props) {
  const [isFollowing, setIsFollowing] = useState(false);

  // Get a reference to the Firestore database
  const db = firebase.firestore();

  useEffect(() => {
    // Fetch the follow status from the database when the component mounts
    db.collection('follows')
      .doc(props.currentUserId)
      .collection('userFollows')
      .doc(props.profileUserId)
      .onSnapshot((docSnapshot) => {
        setIsFollowing(docSnapshot.exists);
      });
  }, [db, props.currentUserId, props.profileUserId]);

  const handleFollow = () => {
    if (isFollowing) {
      // Unfollow the user
      db.collection('follows')
        .doc(props.currentUserId)
        .collection('userFollows')
        .doc(props.profileUserId)
        .delete();
    } else {
      // Follow the user
      db.collection('follows')
        .doc(props.currentUserId)
        .collection('userFollows')
        .doc(props.profileUserId)
        .set({});
    }
  };

  return (
    <button onClick={handleFollow}>{isFollowing ? 'Unfollow' : 'Follow'}</button>
  );
}

export default FollowButton;