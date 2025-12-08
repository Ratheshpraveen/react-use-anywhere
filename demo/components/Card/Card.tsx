import React from 'react';
import './Card.scss';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  header,
  footer
}) => {
  return (
    <div className={`card card--${variant} ${className}`}>
      {header && (
        <div className="card__header">
          {typeof header === 'string' ? (
            <h2 className="card__header-title">{header}</h2>
          ) : (
            header
          )}
        </div>
      )}
      <div className="card__body">{children}</div>
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
};

export default Card;
