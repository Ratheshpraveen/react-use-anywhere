import React from 'react';
import { Card } from './Card';
import { FaUser } from 'react-icons/fa';

export const CardDemo: React.FC = () => {
  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      <Card 
        title="Default Card" 
        icon={<FaUser />}
        footer={
          <>
            <button>Cancel</button>
            <button>Confirm</button>
          </>
        }
      >
        This is a default card with a header, content, and footer.
      </Card>

      <Card 
        title="Elevated Card" 
        variant="elevated"
      >
        This is an elevated card with more prominent shadow.
      </Card>

      <Card 
        title="Outlined Card" 
        variant="outlined"
      >
        This is an outlined card with a transparent background.
      </Card>
    </div>
  );
};
