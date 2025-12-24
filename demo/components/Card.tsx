import React from 'react';
import { useHook } from '../../lib';

interface CardProps {
  title: string;
  content: string;
  imageUrl?: string;
  onClick?: () => void;
}

interface ThemeState {
  theme: string;
  isDark: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  content, 
  imageUrl, 
  onClick 
}) => {
  // Use theme hook to dynamically style the card
  const theme = useHook<ThemeState>('theme');

  const cardStyle = {
    backgroundColor: theme?.isDark ? '#444' : '#fff',
    color: theme?.isDark ? '#fff' : '#333',
    border: ,
    borderRadius: '8px',
    padding: '1rem',
    margin: '1rem 0',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    cursor: onClick ? 'pointer' : 'default',
    transform: onClick ? 'hover:scale(1.02)' : 'none',
  };

  const imageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover' as const,
    borderRadius: '4px',
    marginBottom: '1rem',
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      style={cardStyle} 
      onClick={handleClick}
      role={onClick ? 'button' : 'article'}
      aria-label={title}
    >
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={title} 
          style={imageStyle} 
        />
      )}
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <p>{content}</p>
    </div>
  );
};
