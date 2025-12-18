import React from 'react';
import PropTypes from 'prop-types';

export interface CardProps {
  title: string;
  description?: string;
  image?: string;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  actionButtons?: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  image,
  className = '',
  variant = 'default',
  size = 'medium',
  actionButtons,
  onClick,
}) => {
  const cardClasses = [
    'card',
    `card-${variant}`,
    `card-${size}`,
    className
  ].join(' ');

  return (
    <div 
      className={cardClasses} 
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {image && (
        <div className="card-image">
          <img src={image} alt={title} />
        </div>
      )}
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        {description && <p className="card-description">{description}</p>}
        {actionButtons && (
          <div className="card-actions">
            {actionButtons}
          </div>
        )}
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  image: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'elevated', 'outlined']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  actionButtons: PropTypes.node,
  onClick: PropTypes.func,
};

export default Card;
