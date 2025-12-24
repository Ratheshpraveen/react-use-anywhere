import React from 'react';

export interface CardProps {
  /**
   * Title of the card
   */
  title?: string;

  /**
   * Content of the card
   */
  children?: React.ReactNode;

  /**
   * Additional CSS classes for customization
   */
  className?: string;

  /**
   * Optional click handler for the card
   */
  onClick?: () => void;
}

/**
 * Card Component - A flexible and reusable card UI element
 */
export const Card: React.FC<CardProps> = ({ 
  title, 
  children, 
  className = '', 
  onClick 
}) => {
  return (
    <div 
      className={`card ${className}`} 
      onClick={onClick}
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow 0.3s ease'
      }}
      role={onClick ? 'button' : undefined}
    >
      {title && (
        <h3 
          style={{
            marginTop: 0,
            marginBottom: '12px',
            fontSize: '1.2rem',
            fontWeight: 600,
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: '8px'
          }}
        >
          {title}
        </h3>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default Card;
