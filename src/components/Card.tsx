import React from 'react';

// TypeScript interface for Card component props
interface CardProps {
  title: string;
  content: string;
  imageUrl?: string;
  onClick?: () => void;
  className?: string;
}

// Functional React component with TypeScript
const Card: React.FC<CardProps> = ({
  title, 
  content, 
  imageUrl, 
  onClick, 
  className = ''
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
    borderRadius: '8px 8px 0 0',
    marginBottom: '12px',
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      style={{...cardStyle, ...(onClick ? { ':hover': { transform: 'scale(1.02)' } } : {})}} 
      className={className}
      onClick={handleClick}
    >
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={title} 
          style={imageStyle} 
        />
      )}
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
};

// Default props
Card.defaultProps = {
  imageUrl: '',
  onClick: undefined,
  className: '',
};

export default Card;
