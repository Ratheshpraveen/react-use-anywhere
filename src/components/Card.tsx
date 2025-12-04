import React from 'react';
import './Card.scss';

// Define prop types for the Card component
interface CardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  imageUrl,
  size = 'medium',
  onClick,
  className = '',
}) => {
  return (
    <div 
      className={`card card--${size} ${className}`} 
      onClick={onClick}
    >
      {imageUrl && (
        <div className="card__image-container">
          <img src={imageUrl} alt={title} className="card__image" />
        </div>
      )}
      <div className="card__content">
        <h3 className="card__title">{title}</h3>
        {description && (
          <p className="card__description">{description}</p>
        )}
      </div>
    </div>
  );
};

// Default props
Card.defaultProps = {
  size: 'medium',
  description: '',
};

export default Card;
