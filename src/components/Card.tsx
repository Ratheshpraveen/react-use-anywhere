import React, { ReactNode } from 'react';

/**
 * Defines the shape of Card component properties
 */
export interface CardProps {
  /**
   * Title of the card
   */
  title: string;

  /**
   * Optional description or subtitle
   */
  description?: string;

  /**
   * URL of the card's image
   */
  imageUrl?: string;

  /**
   * Alternative text for the image
   */
  imageAlt?: string;

  /**
   * Optional children to render inside the card
   */
  children?: ReactNode;

  /**
   * Optional click handler for the card
   */
  onClick?: () => void;

  /**
   * Optional custom class name for additional styling
   */
  className?: string;

  /**
   * Optional variant for different card styles
   */
  variant?: 'default' | 'outlined' | 'elevated';
}

/**
 * Card Component - A flexible and reusable card component
 * 
 * @param props Card component properties
 * @returns Rendered Card component
 */
export const Card: React.FC<CardProps> = ({
  title,
  description,
  imageUrl,
  imageAlt,
  children,
  onClick,
  className = '',
  variant = 'default'
}) => {
  const cardClasses = `
    card 
    ${variant === 'outlined' ? 'card-outlined' : ''}
    ${variant === 'elevated' ? 'card-elevated' : ''}
    ${className}
  `.trim();

  return (
    <div 
      className={cardClasses} 
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {imageUrl && (
        <div className="card-image-container">
          <img 
            src={imageUrl} 
            alt={imageAlt || title || 'Card image'} 
            className="card-image"
          />
        </div>
      )}
      
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        {description && (
          <p className="card-description">{description}</p>
        )}
        {children && (
          <div className="card-children">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

// Default props for the Card component
Card.defaultProps = {
  variant: 'default',
  className: '',
  imageAlt: '',
};

export default Card;
