import React, { useState, useRef } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import './ImageUploader.css'; // Import your custom CSS for styling

function ImageUploader({ onImageUpload }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    onImageUpload(file);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    setSelectedImage(file);
  };

  const handleImageUpload = () => {
    if (selectedImage) {
      const storage = getStorage();
      const uniqueImageName = `${Date.now()}_${selectedImage.name}`;
      const storageRef = ref(storage, `images/${uniqueImageName}`);
      uploadBytes(storageRef, selectedImage).then(async (snapshot) => {
        console.log('Uploaded a file:', snapshot);
        
        // Get the download URL of the uploaded image
        const imageUrl = await getDownloadURL(storageRef);
        
        // Call the onImageUpload callback with the URL of the uploaded image
        console.log(imageUrl);
        onImageUpload(selectedImage);
      }).catch((error) => {
        console.error('Error uploading image:', error);
      });
    }
  };

  const openFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      <div className="upload-container">
        {selectedImage ? (
          <div className="selected-image">
            <button onClick={() => openFileInput}>Click to browse</button>
          </div>
        ) : (
          <div
          className={`image-uploader ${isDragging ? 'drag-over' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileInput}
        >
          <div className="upload-prompt">
            <span>Drag and drop an image or</span>
            <button onClick={openFileInput}>Click to browse</button>
          </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ImageUploader;