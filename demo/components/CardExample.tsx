import React from 'react';
import { Card } from './Card';

export const CardExample: React.FC = () => {
  return (
    <div>
      <Card title="User Profile">
        <p>Name: John Doe</p>
        <p>Email: john.doe@example.com</p>
      </Card>

      <Card 
        title="Clickable Card" 
        onClick={() => alert('Card clicked!')}
        className="my-custom-card"
      >
        <p>Click me to see an alert</p>
      </Card>
    </div>
  );
};

export default CardExample;
