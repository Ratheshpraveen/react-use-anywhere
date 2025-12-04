import React, { ReactNode } from 'react';
import '../styles/Card.scss';

// Define prop types for the Card component
interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  className?: string;
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  disabled = false,
  selected = false,
  onClick
}) => {
  // Combine classes
  const cardClasses = [
    'card',
    `card--${variant}`,
    disabled ? 'card--disabled' : '',
    selected ? 'card--selected' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cardClasses} 
      onClick={!disabled ? onClick : undefined}
      role="article"
      tabIndex={disabled ? -1 : 0}
    >
      {children}
    </div>
  );
};

// Sub-components for more structured card layout
Card.Header = ({ children }: { children: ReactNode }) => (
  <div className="card__header">{children}</div>
);

Card.Content = ({ children }: { children: ReactNode }) => (
  <div className="card__content">{children}</div>
);

Card.Actions = ({ children }: { children: ReactNode }) => (
  <div className="card__actions">{children}</div>
);

Card.Image = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} alt={alt} className="card__image" />
);

export default Card;
