import React, { ReactNode } from 'react';

interface CardProps {
  /**
   * The main content of the card
   */
  children: ReactNode;
  
  /**
   * Optional title for the card
   */
  title?: string;
  
  /**
   * Optional className for additional styling
   */
  className?: string;
  
  /**
   * Optional click handler for the entire card
   */
  onClick?: () => void;
}

/**
 * Card Component - A flexible and reusable card UI component
 * @param props Card component properties
 */
export const Card: React.FC<CardProps> = ({ 
  children, 
  title, 
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
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
