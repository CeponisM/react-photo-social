import React, { useState, useRef } from 'react';
import ImageUploader from '../../imageUploader/ImageUploader'; // Adjust the path as needed
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import 'tui-image-editor/dist/tui-image-editor.css';
import ImageEditor from '@toast-ui/react-image-editor';
import './NewPost.css'; // Import the CSS file

function NewPost({ onNewPost }) {
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [editing, setEditing] = useState(false);

  const imageEditorRef = useRef(null); // Initialize as null

  const handleImageSelect = (file) => {
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setEditing(true); // Start editing when an image is selected
  };

  const handleImageEdit = () => {
    if (imageEditorRef.current) { // Check if the ref is defined
      const editedImageBlob = imageEditorRef.current.getInstance().toDataURL();
      // Convert the data URL to a Blob
      const byteString = atob(editedImageBlob.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const editedImageBlobObject = new Blob([ab], { type: 'image/png' });

      setImageFile(editedImageBlobObject);
      setImageUrl(URL.createObjectURL(editedImageBlobObject));
      setEditing(false); // Finish editing
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageFile) {
      setUploading(true);
      try {
        const storage = getStorage();
        const uniqueImageName = `${Date.now()}_${Math.random()
          .toString(36)
          .substring(7)}`;
        const storageRef = ref(storage, `images/${uniqueImageName}`);
        await uploadBytes(storageRef, imageFile);
        const downloadUrl = await getDownloadURL(storageRef);

        // Call onNewPost with caption and imagePath
        onNewPost(caption, downloadUrl);
        setCaption('');
        setImageUrl(null);
        setImageFile(null);
      } catch (error) {
        console.error('Error creating post:', error);
        setUploadError('Error creating post. Please try again.');
      } finally {
        setUploading(false);
      }
    } else {
      // Handle the case where no image is selected
      console.error('No image selected for upload.');
    }
  };

  return (
    <div className="new-post-container">
      <h2 className="new-post-title">Create a New Post</h2>
      <form className="new-post-form" onSubmit={handleSubmit}>
        <textarea
          className="new-post-textarea"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        {/* Pass the handleImageSelect function as onImageUpload */}
        <ImageUploader onImageUpload={handleImageSelect} />
        {editing ? (
          <div className="image-editor-container">
            {/* Render the image editor while editing */}
            <ImageEditor
              ref={imageEditorRef}
              includeUI={{
                loadImage: {
                  path: imageUrl,
                  name: 'SampleImage',
                },
                menu: [
                  'crop',
                  'flip',
                  'rotate',
                  'draw',
                  'shape',
                  'icon',
                  'text',
                  'mask',
                  'filter',
                ],
                initMenu: '',
                uiSize: {
                  width: '100%',
                  height: '700px',
                },
                menuBarPosition: 'bottom',
              }}
              cssMaxHeight={500}
              cssMaxWidth={700}
              selectionStyle={{
                cornerSize: 20,
                rotatingPointOffset: 70,
              }}
              usageStatistics={true}
            />
            <button onClick={handleImageEdit}>Done Editing</button>
          </div>
        ) : (
          // Conditionally render the "Post" button
          imageFile ? (
            <button
              className="new-post-image-upload-button"
              type="submit"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Post'}
            </button>
          ) : null
        )}
        {uploadError && <p className="error">{uploadError}</p>}
      </form>
    </div>
  );
}

export default NewPost;