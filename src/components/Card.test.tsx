import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card Component', () => {
  test('renders card with title and content', () => {
    render(
      <Card 
        title="Test Card" 
        content="This is a test card content" 
      />
    );
    
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('This is a test card content')).toBeInTheDocument();
  });

  test('renders card with image', () => {
    render(
      <Card 
        title="Image Card" 
        imageUrl="https://example.com/image.jpg" 
      />
    );
    
    const image = screen.getByAltText('Image Card');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  test('renders card with actions', () => {
    const actions = <button>Click me</button>;
    render(
      <Card 
        title="Card with Actions" 
        actions={actions} 
      />
    );
    
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
