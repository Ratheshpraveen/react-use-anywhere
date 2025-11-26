import React from 'react';

// Define Button variant types
export type ButtonVariant = 'primary' | 'secondary' | 'outline';

// Define Button size types
export type ButtonSize = 'small' | 'medium' | 'large';

// Button props interface
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

// Reusable Button Component
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  disabled = false,
  ...rest
}) => {
  // Base button styles
  const baseStyles = 'rounded-md transition-all duration-300 focus:outline-none focus:ring-2';

  // Variant-specific styles
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-300',
    outline: 'border border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-300',
  };

  // Size-specific styles
  const sizeStyles = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  // Disabled state styles
  const disabledStyles = 'opacity-50 cursor-not-allowed';

  // Combine all styles
  const combinedClassName = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    disabled ? disabledStyles : 'hover:opacity-90',
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={combinedClassName}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
