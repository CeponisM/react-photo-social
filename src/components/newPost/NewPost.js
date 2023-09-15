import React, { useState } from 'react';
import ImageUploader from '../../imageUploader/ImageUploader'; // Adjust the path as needed

function NewPost({ onNewPost }) {
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleImageSelect = (imageFile) => {
    setImageUrl(imageFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageUrl) {
      try {
        // Call onNewPost with caption and imagePath
        onNewPost(caption, imageUrl);
        setCaption('');
        setImageUrl(null);
      } catch (error) {
        console.error('Error creating post:', error);
        setUploadError('Error creating post. Please try again.');
      }
    } else {
      // Handle the case where no image is selected
      console.error('No image selected for upload.');
    }
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
        {/* Pass the handleImageSelect function as onImageUpload */}
        <ImageUploader onImageUpload={handleImageSelect} />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Creating Post...' : 'Post'}
        </button>
        {uploadError && <p className="error">{uploadError}</p>}
      </form>
    </div>
  );
}

export default NewPost;