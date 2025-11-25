import React from 'react';

// Define the interface for Card component props
export interface CardProps {
  /**
   * The title of the card
   */
  title: string;

  /**
   * The content of the card
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
   * Optional custom className for additional styling
   */
  className?: string;
}

/**
 * Card Component - A flexible and reusable card component
 * @param props CardProps - Properties for configuring the card
 * @returns React.ReactElement
 */
const Card: React.FC<CardProps> = ({
  title, 
  content, 
  imageUrl, 
  onClick, 
  className = ''
}) => {
  // Inline styles with TypeScript type assertion
  const cardStyle: React.CSSProperties = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    maxWidth: '300px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 0.2s',
    ...(onClick && {
      ':hover': {
        transform: 'scale(1.02)'
      }
    })
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      style={cardStyle} 
      className={`card ${className}`}
      onClick={handleClick}
    >
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={title} 
          style={{ 
            width: '100%', 
            borderRadius: '4px', 
            marginBottom: '12px' 
          }} 
        />
      )}
      <h3 style={{ margin: '0 0 8px 0' }}>{title}</h3>
      {content && <p style={{ margin: 0, color: '#666' }}>{content}</p>}
    </div>
  );
};

// Default props
Card.defaultProps = {
  content: '',
  imageUrl: '',
  onClick: undefined,
  className: ''
};

export default Card;
