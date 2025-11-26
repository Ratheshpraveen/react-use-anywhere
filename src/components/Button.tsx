import React, { ReactNode, ButtonHTMLAttributes } from 'react';

// Define the variant types
type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';

// Define the Button component props interface
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The variant of the button
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Optional icon to be displayed before the button text
   */
  icon?: ReactNode;

  /**
   * Additional className for custom styling
   */
  className?: string;

  /**
   * Children (button text or content)
   */
  children?: ReactNode;
}

/**
 * Reusable Button Component
 * Supports different variants, custom styling, and optional icons
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  icon,
  className = '',
  children,
  ...rest
}) => {
  // Base button styles
  const baseStyles = 'rounded-md px-4 py-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';

  // Variant-specific styles
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    tertiary: 'bg-transparent text-blue-500 hover:bg-blue-50 focus:ring-blue-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  };

  // Disabled state styles
  const disabledStyles = rest.disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : '';

  // Combine all styles
  const combinedClassName = `
    ${baseStyles} 
    ${variantStyles[variant]} 
    ${disabledStyles} 
    ${className}
  `.trim();

  return (
    <button 
      className={combinedClassName} 
      {...rest}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
