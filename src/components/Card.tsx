import React from 'react';

// Card component props interface for type safety
export interface CardProps {
  title: string;
  content: string;
  imageUrl?: string;
  onClick?: () => void;
}

// Card component implementation
const Card: React.FC<CardProps> = ({
  title, 
  content, 
  imageUrl, 
  onClick
}) => {
  const cardStyle: React.CSSProperties = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    maxWidth: '300px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 0.2s',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '12px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '8px',
  };

  const contentStyle: React.CSSProperties = {
    color: '#666',
  };

  return (
    <div 
      style={{
        ...cardStyle,
        ...(onClick ? { ':hover': { transform: 'scale(1.02)' } } : {})
      }}
      onClick={onClick}
    >
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={title} 
          style={imageStyle} 
        />
      )}
      <div style={titleStyle}>{title}</div>
      <div style={contentStyle}>{content}</div>
    </div>
  );
};

// Default props
Card.defaultProps = {
  imageUrl: '',
  onClick: undefined,
};

export default Card;
