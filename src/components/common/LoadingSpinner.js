import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 24, text = 'Đang tải...' }) => {
  return (
    <div className="loading-spinner">
      <Loader2 size={size} className="spinner-icon" />
      <span className="spinner-text">{text}</span>
    </div>
  );
};

export default LoadingSpinner;