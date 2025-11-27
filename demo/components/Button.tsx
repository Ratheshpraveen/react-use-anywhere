import React from 'react';

// Define the prop types for the Button component
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The variant of the button
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline';

  /**
   * The size of the button
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Optional icon to be displayed before the button text
   */
  icon?: React.ReactNode;

  /**
   * Additional custom className for further customization
   */
  className?: string;
}

/**
 * Reusable Button Component
 * Supports different variants, sizes, and optional icon
 */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  icon,
  className = '',
  ...rest
}) => {
  // Define base styles with Tailwind-like classes
  const baseStyles = 'rounded-md transition-all duration-300 flex items-center justify-center gap-2';
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-300',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-300',
    outline: 'border border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-2 focus:ring-blue-300 bg-transparent',
  };

  // Size styles
  const sizeStyles = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  // Disabled state styles
  const disabledStyles = 'opacity-50 cursor-not-allowed';

  // Combine all styles
  const combinedClassName = `
    ${baseStyles} 
    ${variantStyles[variant]} 
    ${sizeStyles[size]} 
    ${disabled ? disabledStyles : 'hover:cursor-pointer'}
    ${className}
  `.trim();

  return (
    <button 
      className={combinedClassName} 
      disabled={disabled}
      {...rest}
    >
      {icon && <span className="button-icon">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
