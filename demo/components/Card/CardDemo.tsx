import React from 'react';
import Card from './Card';

const CardDemo: React.FC = () => {
  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <Card 
        title="User Profile" 
        variant="primary"
        footer={
          <>
            <button className="card-button card-button--secondary">Cancel</button>
            <button className="card-button card-button--primary">Save</button>
          </>
        }
      >
        <p>This is a sample card component with a header, body, and footer.</p>
        <p>You can customize its appearance and content easily.</p>
      </Card>

      <div style={{ marginTop: '20px' }}>
        <Card 
          title="Success Card" 
          variant="success"
        >
          <p>This is a success variant card with a green top border.</p>
        </Card>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Card 
          title="Warning Card" 
          variant="warning"
          footer={<button className="card-button card-button--primary">Acknowledge</button>}
        >
          <p>This is a warning variant card with an orange top border.</p>
        </Card>
      </div>
    </div>
  );
};

export default CardDemo;
