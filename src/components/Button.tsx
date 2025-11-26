import React from 'react';

// Define the prop types for the Button component
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The visual variant of the button
   */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  
  /**
   * The size of the button
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Additional custom className to extend or override default styles
   */
  className?: string;
}

/**
 * Reusable Button Component
 * Provides a flexible and accessible button with multiple variants and sizes
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  ...rest
}) => {
  // Base button classes
  const baseClasses = 'rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200';
  
  // Variant-specific classes
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    tertiary: 'bg-transparent text-blue-500 hover:bg-blue-50 focus:ring-blue-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500'
  };
  
  // Size-specific classes
  const sizeClasses = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  // Combine all classes
  const combinedClasses = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    ${className}
  `.trim();

  return (
    <button 
      className={combinedClasses}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
