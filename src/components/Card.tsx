import React from 'react';
import '../styles/_card.scss';

// Define prop types for the Card component
interface CardProps {
  title?: string;
  content?: string;
  image?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'compact';
  fullWidth?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  content,
  image,
  variant = 'default',
  fullWidth = false,
  className = '',
  children,
  onClick,
  ...rest
}) => {
  // Combine classes based on props
  const cardClasses = [
    'card',
    `card--${variant}`,
    fullWidth ? 'card--full-width' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cardClasses} 
      onClick={onClick}
      role="article"
      {...rest}
    >
      {image && (
        <img 
          src={image} 
          alt={title || 'Card image'} 
          className="card__image" 
        />
      )}
      
      {(title || content) && (
        <div className="card__header">
          {title && <h3 className="card__title">{title}</h3>}
          {content && <p className="card__content">{content}</p>}
        </div>
      )}
      
      {children}
    </div>
  );
};

export default Card;
