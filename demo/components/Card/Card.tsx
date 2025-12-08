import React from 'react';
import './Card.scss';

interface CardProps {
  title: string;
  content: string;
  imageUrl?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ 
  title, 
  content, 
  imageUrl, 
  onClick 
}) => {
  return (
    <div className="card" onClick={onClick}>
      {imageUrl && (
        <div className="card__image">
          <img src={imageUrl} alt={title} />
        </div>
      )}
      <div className="card__content">
        <h3 className="card__title">{title}</h3>
        <p className="card__description">{content}</p>
      </div>
    </div>
  );
};

export default Card;
