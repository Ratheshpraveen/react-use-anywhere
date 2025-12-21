import React from 'react';
import './Card.css';

// Define the prop types for the Card component
export interface CardProps {
  title?: string;
  content?: string;
  imageUrl?: string;
  actions?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  content,
  imageUrl,
  actions,
  onClick,
  className = '',
}) => {
  return (
    <div 
      className={`card ${className}`} 
      onClick={onClick}
      role="button"
      tabIndex={onClick ? 0 : undefined}
      aria-label={title || 'Card'}
    >
      {imageUrl && (
        <div className="card-image">
          <img src={imageUrl} alt={title || 'Card image'} />
        </div>
      )}
      <div className="card-content">
        {title && <h3 className="card-title">{title}</h3>}
        {content && <p className="card-text">{content}</p>}
        {actions && <div className="card-actions">{actions}</div>}
      </div>
    </div>
  );
};

export default Card;
