import React from 'react';
import { Card } from './Card/Card';

export const Home: React.FC = () => {
  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      <Card title="Default Card">
        This is a default card with some content.
      </Card>
      
      <Card 
        title="Elevated Card" 
        variant="elevated"
        footer={
          <>
            <button>Cancel</button>
            <button>Confirm</button>
          </>
        }
      >
        This is an elevated card with a footer.
      </Card>
      
      <Card 
        title="Outlined Card" 
        variant="outlined"
      >
        This is an outlined card with minimal styling.
      </Card>
    </div>
  );
};
