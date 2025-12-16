import React from 'react';
import './Card.scss';

export interface CardProps {
  title?: string;
  content?: React.ReactNode;
  image?: string;
  actions?: React.ReactNode;
  className?: string;
  variant?: 'basic' | 'elevated' | 'outlined';
}

const Card: React.FC<CardProps> = ({
  title,
  content,
  image,
  actions,
  className = '',
  variant = 'basic'
}) => {
  return (
    <div className={`card card--${variant} ${className}`}>
      {image && <img src={image} alt={title} className="card__image" />}
      <div className="card__content">
        {title && <h3 className="card__title">{title}</h3>}
        {content && <div className="card__body">{content}</div>}
        {actions && <div className="card__actions">{actions}</div>}
      </div>
    </div>
  );
};

export default Card;
