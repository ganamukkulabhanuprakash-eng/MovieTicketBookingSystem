import React from 'react';
import Button from './Button';

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action 
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg border border-dashed border-border bg-surface-elevated/30">
      {Icon && (
        <div className="h-12 w-12 rounded-full bg-surface flex items-center justify-center mb-4 text-text-muted">
          <Icon size={24} />
        </div>
      )}
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {title}
      </h3>
      <p className="text-sm text-text-secondary max-w-sm mb-6">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} variant="primary">
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
