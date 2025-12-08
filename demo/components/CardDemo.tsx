import React from 'react';
import Card from './Card/Card';

const CardDemo: React.FC = () => {
  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <Card 
        header="User Profile" 
        footer={
          <>
            <button>Edit</button>
            <button>Close</button>
          </>
        }
        variant="elevated"
      >
        <div>
          <h3>John Doe</h3>
          <p>Software Engineer</p>
          <p>Email: john.doe@example.com</p>
        </div>
      </Card>

      <div style={{ marginTop: '20px' }}>
        <Card 
          header={<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Project Details</span>
            <span style={{ color: 'green' }}>Active</span>
          </div>}
          variant="outlined"
        >
          <div>
            <h4>React Component Library</h4>
            <p>A reusable component library for React applications</p>
            <p>Status: In Development</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CardDemo;
