import React from 'react';
import classNames from 'classnames';

// Define the prop types for the Button component
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The visual variant of the button
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost';

  /**
   * The size of the button
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Optional icon to be displayed before or after the button text
   */
  icon?: React.ReactNode;

  /**
   * Position of the icon
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';

  /**
   * Additional custom class names
   */
  className?: string;

  /**
   * Children (button text or content)
   */
  children?: React.ReactNode;
}

/**
 * Reusable Button Component
 * Supports different variants, sizes, and icon configurations
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  className,
  children,
  ...rest
}) => {
  // Generate dynamic classes based on props
  const buttonClasses = classNames(
    'btn', // Base button class
    `btn-${variant}`, // Variant-specific class
    `btn-${size}`, // Size-specific class
    {
      'btn-with-icon': icon,
      'btn-icon-left': icon && iconPosition === 'left',
      'btn-icon-right': icon && iconPosition === 'right',
    },
    className // Allow custom classes to override or extend default classes
  );

  return (
    <button className={buttonClasses} {...rest}>
      {icon && iconPosition === 'left' && <span className="btn-icon btn-icon-left">{icon}</span>}
      {children && <span className="btn-text">{children}</span>}
      {icon && iconPosition === 'right' && <span className="btn-icon btn-icon-right">{icon}</span>}
    </button>
  );
};

export default Button;
