import React, { useState } from 'react';
import Slider from '../components/Slider';

const SliderDemo = () => {
  const [sliderValue, setSliderValue] = useState(50);

  const handleSliderChange = (value) => {
    setSliderValue(value);
    console.log('Slider value changed:', value);
  };

  return (
    <div>
      <h2>Slider Component Demo</h2>
      <div style={{ margin: '20px 0' }}>
        <Slider 
          min={0} 
          max={100} 
          step={1} 
          defaultValue={50} 
          onChange={handleSliderChange}
          aria-label="Example Slider"
        />
        <p>Current Value: {sliderValue}</p>
      </div>

      <div style={{ margin: '20px 0' }}>
        <h3>Slider with Different Range</h3>
        <Slider 
          min={-50} 
          max={50} 
          step={5} 
          defaultValue={0} 
          aria-label="Range Slider"
        />
      </div>
    </div>
  );
};

export default SliderDemo;
