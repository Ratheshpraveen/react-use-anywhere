import React from 'react';
import './Card.css';

// Define the prop types for the Card component
export interface CardProps {
  title?: string;
  content?: React.ReactNode;
  image?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'basic' | 'image' | 'clickable' | 'compact';
}

const Card: React.FC<CardProps> = ({
  title,
  content,
  image,
  onClick,
  className = '',
  variant = 'basic'
}) => {
  // Determine card classes based on variant
  const cardClasses = [
    'card',
    `card-${variant}`,
    className
  ].filter(Boolean).join(' ');

  // Render different card variants
  const renderCardContent = () => {
    switch (variant) {
      case 'image':
        return (
          <>
            {image && <img src={image} alt={title} className="card-image" />}
            <div className="card-content">
              {title && <h3 className="card-title">{title}</h3>}
              {content && <p className="card-text">{content}</p>}
            </div>
          </>
        );
      case 'clickable':
        return (
          <div 
            className="card-clickable-content"
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && onClick?.()}
          >
            {title && <h3 className="card-title">{title}</h3>}
            {content && <p className="card-text">{content}</p>}
          </div>
        );
      case 'compact':
        return (
          <div className="card-compact-content">
            {title && <h3 className="card-title card-title-compact">{title}</h3>}
            {content && <p className="card-text card-text-compact">{content}</p>}
          </div>
        );
      default:
        return (
          <>
            {title && <h3 className="card-title">{title}</h3>}
            {content && <p className="card-text">{content}</p>}
          </>
        );
    }
  };

  return (
    <div 
      className={cardClasses} 
      {...(onClick && variant === 'clickable' ? { onClick } : {})}
    >
      {renderCardContent()}
    </div>
  );
};

export default Card;
