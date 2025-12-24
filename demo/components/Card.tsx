import React from 'react';

// Define prop types for type safety
interface CardProps {
  title: string;
  description?: string;
  image?: string;
  onClick?: () => void;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  title, 
  description, 
  image, 
  onClick, 
  className = ''
}) => {
  return (
    <div 
      className={`card ${className}`} 
      onClick={onClick}
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '16px',
        maxWidth: '300px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease-in-out',
        transform: onClick ? 'hover:scale(1.02)' : 'none'
      }}
    >
      {image && (
        <div 
          className="card-image" 
          style={{
            width: '100%',
            height: '200px',
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '8px',
            marginBottom: '12px'
          }}
        />
      )}
      <div className="card-content">
        <h3 
          style={{
            margin: '0 0 8px 0',
            fontSize: '1.2rem',
            fontWeight: 600
          }}
        >
          {title}
        </h3>
        {description && (
          <p 
            style={{
              margin: 0,
              color: '#666',
              fontSize: '0.9rem'
            }}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

// Default props
Card.defaultProps = {
  description: '',
  image: '',
  onClick: undefined,
  className: ''
};

export default Card;
