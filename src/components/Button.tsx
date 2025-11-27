import React from 'react';

// Define the variant types for the button
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';

// Define the size types for the button
type ButtonSize = 'small' | 'medium' | 'large';

// Button component props interface
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The visual variant of the button
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * The size of the button
   * @default 'medium'
   */
  size?: ButtonSize;

  /**
   * Additional custom class names to apply to the button
   */
  className?: string;

  /**
   * Custom styles to override default styling
   */
  style?: React.CSSProperties;

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Children elements to be rendered inside the button
   */
  children: React.ReactNode;
}

/**
 * Reusable Button Component
 * 
 * A flexible and customizable button component that supports 
 * different variants, sizes, and custom styling.
 * 
 * @example
 * <Button variant="primary" size="medium" onClick={handleClick}>
 *   Click me
 * </Button>
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  className = '',
  style,
  disabled = false,
  children,
  ...rest
}) => {
  // Base button classes
  const baseClasses = 'rounded-md transition-all duration-300 focus:outline-none';

  // Variant-specific classes
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-300',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-2 focus:ring-gray-300',
    outline: 'border border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-2 focus:ring-blue-300',
    text: 'text-blue-500 hover:bg-blue-50 hover:underline',
  };

  // Size-specific classes
  const sizeClasses = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  // Disabled state classes
  const disabledClasses = 'opacity-50 cursor-not-allowed';

  // Combine all classes
  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabled ? disabledClasses : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={combinedClasses}
      style={style}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
