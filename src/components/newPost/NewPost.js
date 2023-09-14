import React, { useState } from 'react';
import ImageUploader from '../../imageUploader/ImageUploader';

function NewPost({ onNewPost }) {
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleImageUpload = (imageURL) => {
    setImageUrl(imageURL);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the onNewPost function with the caption and image URL
    onNewPost(caption, imageUrl);
    setCaption('');
    setImageUrl('');
  };

  return (
    <div>
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        ></textarea>
        <ImageUploader onImageUpload={handleImageUpload} />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}

export default NewPost;
