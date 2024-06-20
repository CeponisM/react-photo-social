import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  deleteDoc,
} from 'firebase/firestore'; // Import Firestore functions
import { auth, db } from '../../firebase'; // Import auth and db
import { motion } from 'framer-motion';
import ConfirmationModal from '../confirmationModal/ConfirmationModal'; // Import the ConfirmationModal component

function Post({ userId, username, imageUrl, caption, postId, setPosts, posts }) {
  const [likes, setLikes] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        // Fetch likes and comments data based on postId
        const postDocRef = doc(db, 'posts', postId);
        const postSnapshot = await getDocs(collection(postDocRef, 'comments'));
        const commentsData = postSnapshot.docs.map((doc) => doc.data().text);

        // Fetch likes count based on postId
        const likesSnapshot = await getDocs(collection(postDocRef, 'likes'));
        const likesCount = likesSnapshot.size;

        setComments(commentsData);
        setLikes(likesCount);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post data:', error);
        setLoading(false);
      }
    };

    fetchPostData();
  }, [postId]);

  const handleLike = async () => {
    setLikes(likes + 1);

    // Add like data to Firestore based on postId
    const postDocRef = doc(db, 'posts', postId);
    await addDoc(collection(postDocRef, 'likes'), {
      userId: auth.currentUser.uid,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setComments([comment, ...comments]);

    // Add comment data to Firestore based on postId
    const postDocRef = doc(db, 'posts', postId);
    await addDoc(collection(postDocRef, 'comments'), {
      userId: auth.currentUser.uid,
      text: comment,
      timestamp: serverTimestamp(),
    });

    setComment('');
  };

  const handleDelete = () => {
    console.log('handle delete')
    // Check if a user is signed in
    if (auth.currentUser) {
      console.log('User is signed in with ID:', auth.currentUser.uid);
      // Check if the signed-in user is the owner of the post
      if (auth.currentUser.uid === userId) {
        console.log('Deleting post with ID:', postId);
        // Show the confirmation modal
        setShowConfirmationModal(true);
        console.log(showConfirmationModal)
      } else {
        console.log('The signed-in user is not the owner of this post.');
      }
    } else {
      console.log('No user is signed in.');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      console.log('Confirmed deletion for post with ID:', postId);

      // Reference to the post in Firestore
      const postDocRef = doc(db, 'posts', postId);

      // Delete 'likes' subcollection
      const likesSnapshot = await getDocs(collection(postDocRef, 'likes'));
      likesSnapshot.docs.forEach(async (doc) => {
        console.log('Deleting like with ID:', doc.id);
        await deleteDoc(doc.ref);  // Delete each 'like'
      });

      // Delete 'comments' subcollection
      const commentsSnapshot = await getDocs(collection(postDocRef, 'comments'));
      commentsSnapshot.docs.forEach(async (doc) => {
        console.log('Deleting comment with ID:', doc.id);
        await deleteDoc(doc.ref);  // Delete each 'comment'
      });

      // Delete the post document
      console.log('Deleting post with ID:', postId);
      await deleteDoc(postDocRef);
      console.log('Post deleted successfully');

      // Update the local state to remove the deleted post
      setPosts(posts.filter(post => post.id !== postId));

      // Hide the confirmation modal after deletion
      setShowConfirmationModal(false);

    } catch (error) {
      console.error('Error deleting post:', error);  // Log any errors
    }
  };

  const handleMouseEnter = () => {
    setShowDeleteButton(true);
  };

  const handleMouseLeave = () => {
    setShowDeleteButton(false);
  };

  const handleCancelDelete = () => {
    // Hide the confirmation modal if canceled
    setShowConfirmationModal(false);
  };


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
      className="post"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showConfirmationModal && (
        <ConfirmationModal
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
      {showDeleteButton && (
        <button className="post__delete" onClick={() => handleDelete()}>
          🗑️ Delete
        </button>
      )}
      <div className="post__header">
        <h2>{username}</h2>
      </div>
      <img src={imageUrl} alt="post" />
      <h4 className="post__text">
        <strong>{username}</strong> {caption}
      </h4>
      <button onClick={handleLike}>Like</button>
      <p>
        {likes} {likes === 1 ? 'like' : 'likes'}
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : (
        comments.map((commentText, index) => (
          <p key={index}>{commentText}</p>
        ))
      )}
    </motion.div>
  );
}

export default Post;