import React from 'react';

// Card component props interface for type safety
export interface CardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'outlined' | 'elevated';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

// Card component implementation
const Card: React.FC<CardProps> = ({
  title,
  description,
  imageUrl,
  onClick,
  className = '',
  variant = 'default',
  size = 'medium',
  disabled = false,
}) => {
  // Combine base classes with variant and size classes
  const cardClasses = [
    'card',
    `card-${variant}`,
    `card-${size}`,
    className,
    disabled ? 'card-disabled' : '',
  ].filter(Boolean).join(' ');

  // Handle click event with disabled state check
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={cardClasses} 
      onClick={handleClick}
      role={onClick ? 'button' : 'article'}
      aria-disabled={disabled}
    >
      {imageUrl && (
        <div className="card-image-container">
          <img 
            src={imageUrl} 
            alt={title} 
            className="card-image" 
          />
        </div>
      )}
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        {description && (
          <p className="card-description">{description}</p>
        )}
      </div>
    </div>
  );
};

// Default props for the Card component
Card.defaultProps = {
  description: '',
  imageUrl: '',
  onClick: undefined,
  className: '',
  variant: 'default',
  size: 'medium',
  disabled: false,
};

export default Card;
