import React, { useState, useRef } from 'react';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

import './ImageUploader.css'; // Import your custom CSS for styling

function ImageUploader({ onImageUpload }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
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
      const storageRef = ref(storage, `images/${selectedImage.name}`);
      uploadBytes(storageRef, selectedImage).then((snapshot) => {
        console.log('Uploaded a file:', snapshot);
        onImageUpload(snapshot.ref.fullPath);
      });
    }
  };

  const openFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className={`image-uploader ${isDragging ? 'drag-over' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
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
            <img src={URL.createObjectURL(selectedImage)} alt="Selected" />
            <button onClick={handleImageUpload}>Upload</button>
          </div>
        ) : (
          <div className="upload-prompt">
            <span>Drag and drop an image or</span>
            <button onClick={openFileInput}>Click to browse</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUploader;