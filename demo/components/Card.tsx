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

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme?.isDark ? '#444' : '#fff',
    color: theme?.isDark ? '#fff' : '#333',
    border: '1px solid ' + (theme?.isDark ? '#666' : '#ddd'),
    borderRadius: '8px',
    padding: '1rem',
    margin: '1rem 0',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    cursor: onClick ? 'pointer' : 'default',
    transform: onClick ? 'scale(1)' : undefined,
    ':hover': onClick ? {
      transform: 'scale(1.02)',
      boxShadow: '0 6px 8px rgba(0,0,0,0.15)'
    } : {}
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '1rem'
  };

  return (
    <div 
      style={cardStyle} 
      onClick={onClick}
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
