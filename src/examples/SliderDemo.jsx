import React, { useState } from 'react';
import Slider from '../components/Slider';

const SliderDemo = () => {
  const [sliderValue, setSliderValue] = useState(50);

  const handleSliderChange = (value) => {
    setSliderValue(value);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Slider Component Demo</h2>
      <div style={{ marginBottom: '20px' }}>
        <p>Current Value: {sliderValue}</p>
        <Slider 
          value={sliderValue}
          onChange={handleSliderChange}
          min={0}
          max={100}
          step={1}
          ariaLabel="Example Slider"
        />
      </div>

      <div>
        <h3>Custom Styled Slider</h3>
        <Slider 
          value={sliderValue}
          onChange={handleSliderChange}
          min={0}
          max={100}
          step={5}
          style={{ 
            height: '30px',
            backgroundColor: '#f0f0f0',
            borderRadius: '15px',
          }}
          ariaLabel="Custom Styled Slider"
        />
      </div>
    </div>
  );
};

export default SliderDemo;
