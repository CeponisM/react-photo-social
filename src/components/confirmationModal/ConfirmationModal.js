import React from 'react';
import './ConfirmationModal.css'; // Import your custom CSS for styling

function ConfirmationModal({ onConfirm, onCancel }) {
  return (
    <div className="confirmation-modal">
      <p>Are you sure you want to delete this post?</p>
      <button className="confirm-button" onClick={onConfirm}>Yes</button>
      <button className="cancel-button" onClick={onCancel}>No</button>
    </div>
  );
}

export default ConfirmationModal;