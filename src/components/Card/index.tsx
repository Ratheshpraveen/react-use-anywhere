import React from 'react';
import PropTypes from 'prop-types';
import './Card.css'; // We'll create this CSS file next

interface CardProps {
  title: string;
  description: string;
  image?: string;
  onClick?: () => void;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  title, 
  description, 
  image, 
  onClick, 
  className = '' 
}) => {
  return (
    <div 
      className={`card ${className}`} 
      onClick={onClick}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : undefined}
    >
      {image && (
        <div className="card-image-container">
          <img 
            src={image} 
            alt={title} 
            className="card-image" 
          />
        </div>
      )}
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string
};

Card.defaultProps = {
  image: '',
  onClick: undefined,
  className: ''
};

export default Card;
