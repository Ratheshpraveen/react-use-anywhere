import React, { useState } from 'react';
import Slider from '../components/Slider';

const SliderDemo = () => {
  // Uncontrolled slider example
  const [uncontrolledValue, setUncontrolledValue] = useState(50);
  
  // Controlled slider example
  const [controlledValue, setControlledValue] = useState(25);

  return (
    <div className="slider-demo">
      <h2>Slider Demonstrations</h2>
      
      {/* Uncontrolled Slider */}
      <div>
        <h3>Uncontrolled Slider</h3>
        <Slider 
          min={0} 
          max={100} 
          step={5} 
          aria-label="Uncontrolled Slider"
          onChange={(value) => setUncontrolledValue(value)}
        />
        <p>Current Value: {uncontrolledValue}</p>
      </div>
      
      {/* Controlled Slider */}
      <div>
        <h3>Controlled Slider</h3>
        <Slider 
          value={controlledValue}
          onChange={setControlledValue}
          min={0} 
          max={50} 
          step={1} 
          aria-label="Controlled Slider"
        />
        <p>Current Value: {controlledValue}</p>
      </div>
      
      {/* Slider with Custom Styling */}
      <div>
        <h3>Custom Styled Slider</h3>
        <Slider 
          min={0} 
          max={200} 
          step={10} 
          className="custom-slider"
          aria-label="Custom Styled Slider"
        />
      </div>
    </div>
  );
};

export default SliderDemo;
