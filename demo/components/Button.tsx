import React from 'react';

// Define the Button variant types
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
export type ButtonSize = 'sm' | 'md' | 'lg';

// Button component props interface
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

// Button component implementation
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}) => {
  // Base button styles
  const baseStyles = 'rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';

  // Variant-specific styles
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    text: 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
  };

  // Size-specific styles
  const sizeStyles = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  // Disabled state styles
  const disabledStyles = rest.disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : '';

  // Combine all styles
  const combinedClassName = `
    ${baseStyles} 
    ${variantStyles[variant]} 
    ${sizeStyles[size]} 
    ${disabledStyles} 
    ${className}
  `.trim();

  return (
    <button 
      className={combinedClassName} 
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
