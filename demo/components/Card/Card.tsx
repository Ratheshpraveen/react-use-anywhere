import React from 'react';
import './Card.scss';

interface CardProps {
  title?: string;
  content?: string;
  image?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  content,
  image,
  variant = 'default',
  className = '',
  onClick
}) => {
  return (
    <div 
      className={} 
      onClick={onClick}
    >
      {image && (
        <div className="card__image-container">
          <img src={image} alt={title || 'Card image'} className="card__image" />
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
