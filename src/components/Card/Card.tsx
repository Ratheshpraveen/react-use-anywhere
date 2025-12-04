import React from 'react';
import './Card.scss';

// Card Variant Types
type CardVariant = 'default' | 'elevated' | 'outlined';

// Card Props Interface
interface CardProps {
  variant?: CardVariant;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <div className={`card card--${variant} ${className}`}>
      <div className="card__content">
        {title && <h3 className="card__title">{title}</h3>}
        {description && <p className="card__description">{description}</p>}
        {children}
      </div>
    </div>
  );
};

export default Card;
