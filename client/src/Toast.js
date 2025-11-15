import React from 'react';
import './Toast.css';

function Toast({ message, onClose }) {
  return (
    <div className="toast-notification">
      <span>{message}</span>
      <button onClick={onClose}>✕</button>
    </div>
  );
}

export default Toast;