import React from 'react';
import Card from './Card';

const CardExample: React.FC = () => {
  return (
    <div style={{ display: 'flex', gap: '16px', padding: '20px' }}>
      <Card 
        title="Default Card" 
        description="This is a default card with standard styling."
      />
      <Card 
        variant="elevated" 
        title="Elevated Card" 
        description="This card has a more pronounced shadow effect."
      />
      <Card 
        variant="outlined" 
        title="Outlined Card" 
        description="This card has a border instead of a shadow."
      />
    </div>
  );
};

export default CardExample;
