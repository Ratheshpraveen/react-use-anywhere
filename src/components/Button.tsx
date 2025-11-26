import React from 'react';

// Define the Button variant types
export type ButtonVariant = 'primary' | 'secondary' | 'outline';

// Define the Button size types
export type ButtonSize = 'small' | 'medium' | 'large';

// Button component props interface
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The visual style variant of the button
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * The size of the button
   * @default 'medium'
   */
  size?: ButtonSize;

  /**
   * Additional custom className to extend or override default styles
   */
  className?: string;

  /**
   * Children elements to be rendered inside the button
   */
  children: React.ReactNode;
}

/**
 * Reusable Button Component
 * Supports different variants, sizes, and standard button attributes
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  className = '',
  children,
  ...rest
}) => {
  // Base button classes
  const baseClasses = 'rounded-md transition-all duration-200 focus:outline-none focus:ring-2';

  // Variant-specific classes
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  };

  // Size-specific classes
  const sizeClasses = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  // Combine all classes
  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

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
