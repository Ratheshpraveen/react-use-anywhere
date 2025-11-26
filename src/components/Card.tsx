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
   * Optional custom class name for additional styling
   */
  className?: string;
}

/**
 * Card Component - A flexible and reusable card component
 * @param props - Card component properties
 * @returns React functional component
 */
export const Card: React.FC<CardProps> = ({
  title = 'Default Title',
  content = 'Default content',
  imageUrl,
  onClick,
  className = '',
}) => {
  return (
    <div 
      className={`card ${className}`} 
      onClick={onClick}
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        maxWidth: '300px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={title} 
          style={{
            width: '100%', 
            height: '200px', 
            objectFit: 'cover', 
            borderRadius: '8px 8px 0 0'
          }} 
        />
      )}
      <div className="card-content">
        <h3 style={{ margin: '10px 0', fontSize: '1.2rem' }}>{title}</h3>
        <p style={{ color: '#666' }}>{content}</p>
      </div>
    </div>
  );
};

export default Card;
