import React, { useState } from 'react';
import Slider from '../components/Slider';

const SliderDemo = () => {
  // Example 1: Basic slider with default configuration
  const [basicValue, setBasicValue] = useState(50);

  // Example 2: Slider with custom range and step
  const [customValue, setCustomValue] = useState(10);

  return (
    <div>
      <h2>Slider Demonstrations</h2>
      
      {/* Basic Slider */}
      <div>
        <h3>Basic Slider (0-100)</h3>
        <Slider 
          value={basicValue} 
          onChange={setBasicValue} 
          aria-label="Basic slider"
        />
        <p>Current Value: {basicValue}</p>
      </div>
      
      {/* Custom Range Slider */}
      <div>
        <h3>Custom Range Slider (10-50, step 5)</h3>
        <Slider 
          min={10} 
          max={50} 
          step={5}
          value={customValue} 
          onChange={setCustomValue}
          aria-label="Custom range slider"
        />
        <p>Current Value: {customValue}</p>
      </div>
    </div>
  );
};

export default SliderDemo;
