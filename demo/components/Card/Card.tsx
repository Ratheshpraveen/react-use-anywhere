import React from 'react';
import './Card.scss';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  footer,
  variant = 'default',
  className = '',
}) => {
  return (
    <div className={`card card--${variant} ${className}`}>
      {title && (
        <div className="card__header">
          <h3 className="card__header-title">{title}</h3>
        </div>
      )}
      <div className="card__content">
        <div className="card__content-text">{children}</div>
      </div>
      {footer && (
        <div className="card__footer">
          {footer}
        </div>
      )}
    </div>
  );
};
