import React, { useState } from 'react';
import './Post.css';

function Post(props) {
  const [likes, setLikes] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setComments([comment, ...comments]);
    setComment('');
  };

  return (
    <div className="post">
      <h2>{props.username}</h2>
      <img src={props.imageUrl} alt="post" />
      <h4 className="post__text"><strong>{props.username}</strong> {props.caption}</h4>
      <button onClick={handleLike}>Like</button>
      <p>{likes} likes</p>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)} />
        <button type="submit">Post</button>
      </form>
      {comments.map((comment, index) => (
        <p key={index}>{comment}</p>
      ))}
    </div>
  );
}

export default Post; 