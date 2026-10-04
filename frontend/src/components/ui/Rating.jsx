import React from 'react';
import { Star } from 'lucide-react';

export const Rating = ({ value, size = 'md' }) => {
  const isSmall = size === 'sm';
  const iconSize = isSmall ? 14 : 18;
  const textSize = isSmall ? 'text-xs' : 'text-sm';
  
  // Format rating to 1 decimal place if it has decimals, otherwise just show integer
  const formattedValue = Number.isInteger(value) ? value : Number(value).toFixed(1);

  return (
    <div className="flex items-center gap-1.5 font-medium text-text-primary">
      <Star 
        size={iconSize} 
        className="text-primary fill-primary" 
      />
      <span className={textSize}>
        {formattedValue}<span className="text-text-muted font-normal">/10</span>
      </span>
    </div>
  );
};

export default Rating;
