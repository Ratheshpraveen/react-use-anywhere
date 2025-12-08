import React from 'react';
import '../assets/Card.scss';

interface CardProps {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  icon,
  children,
  footer,
  variant = 'default',
  className = '',
}) => {
  return (
    <div className={`card card--${variant} ${className}`}>
      {(title || icon) && (
        <div className="card__header">
          {icon && <div className="card__header-icon">{icon}</div>}
          {title && <h3 className="card__header-title">{title}</h3>}
        </div>
      )}
      
      <div className="card__content">
        {children}
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
