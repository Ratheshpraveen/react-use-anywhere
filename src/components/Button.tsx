import React from 'react';

// Define button variant types
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';

// Define button size types
export type ButtonSize = 'small' | 'medium' | 'large';

// Button component props interface
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

// Base styles and variant-specific styles
const baseStyles = 'rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50';

const variantStyles = {
  primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300',
  secondary: 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-300',
  outline: 'border border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-200',
  text: 'text-blue-500 hover:bg-blue-50 focus:ring-blue-200',
};

const sizeStyles = {
  small: 'px-2 py-1 text-sm',
  medium: 'px-4 py-2 text-base',
  large: 'px-6 py-3 text-lg',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  className = '',
  children,
  ...rest
}) => {
  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
