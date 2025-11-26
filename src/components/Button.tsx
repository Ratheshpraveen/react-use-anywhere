import React from 'react';

// Define the prop types for the Button component
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  className?: string;
}

// Button component with flexible styling and prop handling
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
  const baseStyles = 'rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';

  // Variant-specific styles
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  // Size-specific styles
  const sizeStyles = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  // Disabled state styles
  const disabledStyles = 'opacity-50 cursor-not-allowed';

  // Width styles
  const widthStyles = fullWidth ? 'w-full' : '';

  // Combine all styles
  const combinedStyles = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${disabled ? disabledStyles : 'hover:opacity-90'}
    ${widthStyles}
    ${className}
  `;

  return (
    <button 
      className={combinedStyles.trim()}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
