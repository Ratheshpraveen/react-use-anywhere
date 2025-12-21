import React from 'react';
import { useHook } from '../../lib';

interface CardProps {
  title: string;
  content: string;
  footer?: string;
  onClick?: () => void;
  className?: string;
}

interface ThemeState {
  theme: string;
  isDark: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  content,
  footer,
  onClick,
  className = '',
}) => {
  const theme = useHook<ThemeState>('theme');

  const cardStyle = {
    backgroundColor: theme?.isDark ? '#444' : '#fff',
    color: theme?.isDark ? '#fff' : '#333',
    border: ,
    borderRadius: '8px',
    padding: '1rem',
    margin: '1rem 0',
    boxShadow: theme?.isDark 
      ? '0 4px 6px rgba(255, 255, 255, 0.1)' 
      : '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    cursor: onClick ? 'pointer' : 'default',
    transform: onClick ? 'scale(1)' : 'none',
    ...(onClick && {
      ':hover': {
        transform: 'scale(1.02)',
      }
    })
  };

  const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: theme?.isDark ? '#f0f0f0' : '#333',
  };

  const contentStyle = {
    fontSize: '1rem',
    marginBottom: '1rem',
  };

  const footerStyle = {
    fontSize: '0.875rem',
    color: theme?.isDark ? '#aaa' : '#666',
    borderTop: ,
    paddingTop: '0.5rem',
    marginTop: '0.5rem',
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={} 
      style={cardStyle} 
      onClick={handleClick}
    >
      <div style={titleStyle}>{title}</div>
      <div style={contentStyle}>{content}</div>
      {footer && (
        <div style={footerStyle}>{footer}</div>
      )}
    </div>
  );
};
