import React from 'react';

export const Input = React.forwardRef(({
  label,
  error,
  icon: Icon,
  type = 'text',
  className = '',
  ...rest
}, ref) => {
  const id = React.useId();
  
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          className={`flex h-10 w-full rounded-md border bg-surface px-3 py-2 text-sm text-text-primary ring-offset-canvas file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors
            ${error ? 'border-error focus-visible:ring-error' : 'border-border focus-visible:border-primary'}
            ${Icon ? 'pl-10' : ''}
            ${className}`}
          {...rest}
        />
      </div>
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
