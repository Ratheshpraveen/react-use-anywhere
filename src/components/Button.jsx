import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable Button Component
 * Supports various variants, sizes, states, and optional icons
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onClick,
  ...rest
}) => {
  // Base button classes
  const baseClasses = 'inline-flex items-center justify-center rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    outline: 'border border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-500',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Disabled and loading states
  const stateClasses = disabled || loading 
    ? 'opacity-50 cursor-not-allowed' 
    : 'hover:opacity-90';

  // Combine all classes
  const buttonClasses = [
    baseClasses,
    variantClasses[variant] || variantClasses.primary,
    sizeClasses[size] || sizeClasses.md,
    stateClasses,
    className
  ].filter(Boolean).join(' ');

  // Handle click with loading and disabled state prevention
  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      data-testid="custom-button"
      {...rest}
    >
      {loading ? (
        <span className="mr-2">Loading...</span>
      ) : (
        <>
          {LeftIcon && <span className="mr-2"><LeftIcon /></span>}
          {children}
          {RightIcon && <span className="ml-2"><RightIcon /></span>}
        </>
      )}
    </button>
  );
};

// PropTypes for type checking and documentation
Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  className: PropTypes.string,
  leftIcon: PropTypes.elementType,
  rightIcon: PropTypes.elementType,
  onClick: PropTypes.func,
};

export default Button;
