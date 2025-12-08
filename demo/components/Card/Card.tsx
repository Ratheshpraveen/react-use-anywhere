import React from 'react';
import './Card.scss';

interface CardProps {
  title?: string;
  variant?: 'primary' | 'success' | 'warning';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ 
  title, 
  variant = 'primary', 
  children, 
  footer 
}) => {
  return (
    <div className={`card card--${variant}`}>
      {title && (
        <div className="card__header">
          <h3 className="card__header-title">{title}</h3>
        </div>
      )}
      <div className="card__body">
        <div className="card__body-content">
          {children}
        </div>
      </div>
      {footer && (
        <div className="card__footer">
          <div className="card__footer-actions">
            {footer}
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
