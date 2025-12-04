import React, { useState } from 'react';
import Slider from './components/Slider';

const App: React.FC = () => {
  const [sliderValue, setSliderValue] = useState(50);

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    console.log('Slider value updated:', value);
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '20px' 
    }}>
      <h1>Slider Component Demos</h1>
      
      {/* Basic Usage */}
      <section style={{ marginBottom: '20px' }}>
        <h2>Basic Slider</h2>
        <Slider 
          min={0} 
          max={100} 
          step={1} 
          label="Basic Slider (0-100)"
        />
      </section>
      
      {/* Slider with onChange Handler */}
      <section style={{ marginBottom: '20px' }}>
        <h2>Controlled Slider</h2>
        <Slider 
          min={0} 
          max={100} 
          step={5} 
          defaultValue={50}
          onChange={handleSliderChange}
          label={`Controlled Slider (Current: ${sliderValue})`}
        />
      </section>
      
      {/* Slider with Narrow Range */}
      <section>
        <h2>Narrow Range Slider</h2>
        <Slider 
          min={10} 
          max={50} 
          step={2} 
          label="Narrow Range Slider (10-50)"
        />
      </section>
    </div>
  );
};

export default App;
