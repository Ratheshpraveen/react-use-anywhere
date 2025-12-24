import React, { ReactNode } from 'react';

interface CardProps {
  /**
   * Title of the card
   */
  title?: string;

  /**
   * Main content of the card
   */
  content?: string | ReactNode;

  /**
   * Image URL for the card
   */
  imageUrl?: string;

  /**
   * Optional actions/buttons for the card
   */
  actions?: ReactNode;

  /**
   * Additional CSS classes for customization
   */
  className?: string;

  /**
   * Styles to be applied to the card
   */
  style?: React.CSSProperties;
}

/**
 * Reusable Card Component
 * Supports title, content, image, and custom actions
 */
export const Card: React.FC<CardProps> = ({
  title,
  content,
  imageUrl,
  actions,
  className = '',
  style = {},
}) => {
  return (
    <div 
      className={`card ${className}`} 
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        ...style
      }}
    >
      {imageUrl && (
        <div className="card-image">
          <img 
            src={imageUrl} 
            alt={title || 'Card Image'} 
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover'
            }} 
          />
        </div>
      )}
      
      <div className="card-content" style={{ padding: '16px' }}>
        {title && (
          <h3 
            style={{ 
              margin: '0 0 12px 0', 
              fontSize: '1.25rem', 
              fontWeight: 600 
            }}
          >
            {title}
          </h3>
        )}
        
        {content && (
          <div className="card-text">
            {typeof content === 'string' ? <p>{content}</p> : content}
          </div>
        )}
      </div>
      
      {actions && (
        <div 
          className="card-actions" 
          style={{ 
            padding: '12px 16px', 
            borderTop: '1px solid #e0e0e0' 
          }}
        >
          {actions}
        </div>
      )}
    </div>
  );
};

export default Card;
