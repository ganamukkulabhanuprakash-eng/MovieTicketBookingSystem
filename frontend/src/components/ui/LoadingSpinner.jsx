import React from 'react';
import { Loader2 } from 'lucide-react';

const sizes = {
  sm: 16,
  md: 24,
  lg: 32,
};

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 
        size={sizes[size]} 
        className="animate-spin text-primary" 
      />
    </div>
  );
};

export default LoadingSpinner;
