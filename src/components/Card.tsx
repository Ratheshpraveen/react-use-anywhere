import React from 'react';
import styled from 'styled-components';

// Card Component Interface
export interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
  actions?: React.ReactNode;
  onClick?: () => void;
}

// Styled Components for Card
const CardContainer = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  margin: 16px;
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 16px;
`;

const CardTitle = styled.h2`
  margin: 0 0 8px 0;
  font-size: 1.25rem;
  color: #333;
`;

const CardDescription = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.875rem;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 8px 16px;
  border-top: 1px solid #e0e0e0;
`;

// Card Component
export const Card: React.FC<CardProps> = ({
  title,
  description,
  imageUrl,
  actions,
  onClick
}) => {
  return (
    <CardContainer onClick={onClick}>
      {imageUrl && <CardImage src={imageUrl} alt={title} />}
      <CardContent>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      {actions && <CardActions>{actions}</CardActions>}
    </CardContainer>
  );
};

// Default Props
Card.defaultProps = {
  imageUrl: undefined,
  actions: null,
  onClick: () => {}
};

export default Card;
