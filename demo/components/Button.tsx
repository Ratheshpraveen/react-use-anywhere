import React from 'react';

// Define Button variant types
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';

// Define Button size types
type ButtonSize = 'small' | 'medium' | 'large';

// Button component props interface
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
   * Optional className to extend or override default styles
   */
  className?: string;

  /**
   * Children to be rendered inside the button
   */
  children: React.ReactNode;
}

// Mapping of variants to Tailwind CSS classes
const variantStyles = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
  outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  text: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500 bg-transparent'
};

// Mapping of sizes to Tailwind CSS classes
const sizeStyles = {
  small: 'px-2 py-1 text-xs',
  medium: 'px-4 py-2 text-sm',
  large: 'px-6 py-3 text-base'
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary', 
  size = 'medium', 
  className = '', 
  children, 
  disabled = false,
  ...props
}) => {
  // Combine base styles with variant and size styles
  const buttonClasses = `
    rounded-md 
    inline-flex 
    items-center 
    justify-center 
    font-medium 
    focus:outline-none 
    focus:ring-2 
    focus:ring-offset-2 
    transition-colors 
    duration-200 
    ${variantStyles[variant]} 
    ${sizeStyles[size]} 
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim();

  return (
    <button 
      className={buttonClasses} 
      disabled={disabled} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
