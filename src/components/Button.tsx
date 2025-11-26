import React from 'react';

// Define Button variant types
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';

// Define Button size types
export type ButtonSize = 'small' | 'medium' | 'large';

// Button component props interface
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

// Reusable Button Component
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  className = '',
  children,
  ...rest
}) => {
  // Base button classes
  const baseClasses = 'rounded-md transition-all duration-300 focus:outline-none focus:ring-2';

  // Variant-specific classes
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-300',
    outline: 'border border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-200',
    text: 'text-blue-500 hover:bg-blue-50 focus:ring-blue-200'
  };

  // Size-specific classes
  const sizeClasses = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };

  // Combine classes
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
