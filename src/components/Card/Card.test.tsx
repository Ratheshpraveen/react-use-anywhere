import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from './Card';

describe('Card Component', () => {
  const mockProps = {
    title: 'Test Card',
    description: 'This is a test description',
    imageUrl: 'https://example.com/image.jpg',
  };

  test('renders card with title', () => {
    render(<Card {...mockProps} />);
    expect(screen.getByText('Test Card')).toBeInTheDocument();
  });

  test('renders description when provided', () => {
    render(<Card {...mockProps} />);
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
  });

  test('renders image when imageUrl is provided', () => {
    render(<Card {...mockProps} />);
    const image = screen.getByAlt('Test Card');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  test('calls onClick when card is clicked', () => {
    const mockOnClick = jest.fn();
    render(<Card {...mockProps} onClick={mockOnClick} />);
    
    const card = screen.getByText('Test Card').closest('div');
    if (card) {
      fireEvent.click(card);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    }
  });

  test('applies correct variant class', () => {
    const { rerender } = render(<Card {...mockProps} variant="default" />);
    let card = screen.getByText('Test Card').closest('div');
    expect(card).toHaveClass('card-default');

    rerender(<Card {...mockProps} variant="outlined" />);
    card = screen.getByText('Test Card').closest('div');
    expect(card).toHaveClass('card-outlined');
  });
});
