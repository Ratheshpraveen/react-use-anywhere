import React from 'react';

// Define the Button props interface
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  className?: string;
}

// Reusable Button Component
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
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
  const disabledStyles = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : 'cursor-pointer';

  // Full width style
  const widthStyle = fullWidth ? 'w-full' : '';

  // Combine all styles
  const combinedClassName = `
    ${baseStyles} 
    ${variantStyles[variant]} 
    ${sizeStyles[size]} 
    ${disabledStyles} 
    ${widthStyle} 
    ${className}
  `.trim();

  return (
    <button
      className={combinedClassName}
      disabled={disabled}
      aria-disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
