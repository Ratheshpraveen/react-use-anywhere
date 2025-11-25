import React from 'react';

// Card component props interface for type safety
export interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'outlined' | 'elevated';
  size?: 'small' | 'medium' | 'large';
}

// Card component implementation
const Card: React.FC<CardProps> = ({
  title,
  description,
  imageUrl,
  onClick,
  className = '',
  variant = 'default',
  size = 'medium'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'outlined':
        return 'border border-gray-300 rounded-lg';
      case 'elevated':
        return 'shadow-md rounded-lg';
      default:
        return 'bg-white rounded-lg';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-48 p-2';
      case 'large':
        return 'w-96 p-6';
      default:
        return 'w-64 p-4';
    }
  };

  return (
    <div 
      className={`
        ${getVariantClasses()} 
        ${getSizeClasses()} 
        ${className} 
        transition-all duration-300 
        hover:shadow-lg 
        cursor-${onClick ? 'pointer' : 'default'}
      `}
      onClick={onClick}
    >
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-48 object-cover rounded-t-lg mb-4" 
        />
      )}
      <div className="px-4 py-2">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

// Default props for the Card component
Card.defaultProps = {
  variant: 'default',
  size: 'medium',
  className: '',
  onClick: undefined,
  imageUrl: undefined
};

export default Card;
