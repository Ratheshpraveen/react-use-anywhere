import React from 'react';
import './Card.scss';

interface CardProps {
  title?: string;
  content?: string;
  imageUrl?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
}

const Card: React.FC<CardProps> = ({
  title,
  content,
  imageUrl,
  onClick,
  className = '',
  variant = 'default'
}) => {
  return (
    <div 
      className={`card card--${variant} ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={onClick ? 0 : undefined}
      aria-label={title}
    >
      {imageUrl && (
        <div className="card__image-container">
          <img 
            src={imageUrl} 
            alt={title || 'Card image'} 
            className="card__image" 
          />
        </div>
      )}
      <div className="card__content">
        {title && <h3 className="card__title">{title}</h3>}
        {content && <p className="card__text">{content}</p>}
      </div>
    </div>
  );
};

export default Card;
