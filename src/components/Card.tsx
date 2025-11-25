import React from 'react';

// Define the interface for Card component props
export interface CardProps {
  /**
   * The title of the card
   */
  title?: string;

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
   * Additional CSS class for custom styling
   */
  className?: string;
}

/**
 * Card Component - A flexible and reusable card UI component
 */
export const Card: React.FC<CardProps> = ({
  title,
  content,
  imageUrl,
  onClick,
  className = '',
}) => {
  // Inline styles with TypeScript type safety
  const cardStyle: React.CSSProperties = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    maxWidth: '300px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 0.2s ease-in-out',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginBottom: '12px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '8px',
  };

  const contentStyle: React.CSSProperties = {
    color: '#666',
    fontSize: '0.9rem',
  };

  return (
    <div 
      style={{...cardStyle, ...(onClick ? { ':hover': { transform: 'scale(1.02)' } } : {})}}
      onClick={onClick}
      className={`card ${className}`}
    >
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={title || 'Card Image'} 
          style={imageStyle} 
        />
      )}
      {title && <div style={titleStyle}>{title}</div>}
      {content && <div style={contentStyle}>{content}</div>}
    </div>
  );
};

// Default props
Card.defaultProps = {
  title: '',
  content: '',
  imageUrl: '',
  onClick: undefined,
  className: '',
};

export default Card;
