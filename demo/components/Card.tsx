import React from 'react';
import './Card.scss';

export interface CardProps {
  title?: string;
  content?: string;
  image?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  title,
  content,
  image,
  variant = 'default',
  className = '',
  children,
  onClick,
}) => {
  return (
    <div 
      className={`card card-${variant} ${className}`} 
      onClick={onClick}
    >
      {image && (
        <div className="card-image">
          <img src={image} alt={title || 'Card image'} />
        </div>
      )}
      
      {(title || content) && (
        <div className="card-content">
          {title && <h3 className="card-title">{title}</h3>}
          {content && <p className="card-description">{content}</p>}
        </div>
      )}
      
      {children && (
        <div className="card-children">
          {children}
        </div>
      )}
    </div>
  );
};
