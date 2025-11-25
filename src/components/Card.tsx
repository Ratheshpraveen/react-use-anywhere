import React from 'react';

// Interface for Card component props
export interface CardProps {
  /**
   * Title of the card
   */
  title?: string;

  /**
   * Content of the card
   */
  content?: string;

  /**
   * Optional image URL for the card
   */
  imageUrl?: string;

  /**
   * Optional click handler for the card
   */
  onClick?: () => void;

  /**
   * Additional CSS class for custom styling
   */
  className?: string;
}

/**
 * Card Component - A flexible and reusable card component
 * @param props - Card component properties
 */
const Card: React.FC<CardProps> = ({
  title = 'Default Title',
  content = 'Default content',
  imageUrl,
  onClick,
  className = '',
}) => {
  const cardStyle: React.CSSProperties = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    maxWidth: '300px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 0.2s',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '8px 8px 0 0',
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      style={{
        ...cardStyle,
        transform: onClick ? 'scale(1.02)' : 'scale(1)',
      }} 
      className={`card ${className}`}
      onClick={handleClick}
    >
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={title} 
          style={imageStyle} 
        />
      )}
      <div className="card-content">
        <h3>{title}</h3>
        <p>{content}</p>
      </div>
    </div>
  );
};

export default Card;
