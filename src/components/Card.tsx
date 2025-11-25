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
   * Additional CSS classes for customization
   */
  className?: string;
}

/**
 * Card Component - A flexible and reusable card component
 * @param props Card component properties
 * @returns Rendered Card component
 */
export const Card: React.FC<CardProps> = ({
  title,
  content,
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
          alt={title || 'Card image'} 
          style={{
            width: '100%',
            borderRadius: '8px',
            marginBottom: '12px',
          }}
        />
      )}
      {title && (
        <h3 style={{ 
          margin: '0 0 10px 0', 
          fontSize: '1.2rem',
          color: '#333' 
        }}>
          {title}
        </h3>
      )}
      {content && (
        <p style={{ 
          margin: '0', 
          color: '#666' 
        }}>
          {content}
        </p>
      )}
    </div>
  );
};

// Default props for the Card component
Card.defaultProps = {
  title: '',
  content: '',
  imageUrl: '',
  onClick: undefined,
  className: '',
};

export default Card;
