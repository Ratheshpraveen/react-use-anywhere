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
  const theme = useHook<ThemeState>('theme');

  const cardStyle = {
    backgroundColor: theme?.isDark ? '#444' : '#fff',
    color: theme?.isDark ? '#fff' : '#333',
    border: '1px solid ' + (theme?.isDark ? '#666' : '#ddd'),
    borderRadius: '8px',
    padding: '1rem',
    margin: '1rem 0',
    boxShadow: theme?.isDark 
      ? '0 4px 6px rgba(255, 255, 255, 0.1)' 
      : '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    cursor: onClick ? 'pointer' : 'default',
    transform: onClick ? 'hover:scale(1.02)' : 'none',
  };

  const imageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover' as const,
    borderRadius: '8px',
    marginBottom: '1rem',
  };

  return (
    <div 
      style={cardStyle} 
      onClick={onClick}
      role={onClick ? 'button' : 'article'}
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
