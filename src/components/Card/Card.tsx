import React from 'react';
import './Card.css'; // We'll create this CSS file next

export interface CardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  variant?: 'default' | 'outlined' | 'elevated';
  onClick?: () => void;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  imageUrl,
  variant = 'default',
  onClick,
  className = '',
}) => {
  return (
    <div 
      className={`card card-${variant} ${className}`} 
      onClick={onClick}
    >
      {imageUrl && (
        <div className="card-image">
          <img src={imageUrl} alt={title} />
        </div>
      )}
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        {description && <p className="card-description">{description}</p>}
      </div>
    </div>
  );
};

export default Card;
