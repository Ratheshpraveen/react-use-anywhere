import React from 'react';
import './Card.css'; // We'll create this in the next step

// Define props interface for flexible card configuration
interface CardProps {
  title?: string;
  content?: string;
  imageUrl?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  link?: string;
  actionButtons?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  content,
  imageUrl,
  onClick,
  className = '',
  variant = 'default',
  link,
  actionButtons
}) => {
  const handleClick = () => {
    if (link) {
      window.location.href = link;
    }
    onClick?.();
  };

  return (
    <div 
      className={`card card-${variant} ${className}`}
      onClick={handleClick}
      role={onClick || link ? 'button' : 'article'}
      tabIndex={onClick || link ? 0 : undefined}
      aria-label={title}
    >
      {imageUrl && (
        <div className="card-image">
          <img src={imageUrl} alt={title || 'Card image'} />
        </div>
      )}
      <div className="card-content">
        {title && <h3 className="card-title">{title}</h3>}
        {content && <p className="card-text">{content}</p>}
        {actionButtons && (
          <div className="card-actions">
            {actionButtons}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
