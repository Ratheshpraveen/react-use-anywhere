import React, { useState } from 'react';
import Slider from './Slider';

const SliderExample = () => {
  const [sliderValue, setSliderValue] = useState(50);

  const handleSliderChange = (value) => {
    setSliderValue(value);
    console.log('Slider value changed:', value);
  };

  return (
    <div>
      <h2>Slider Example</h2>
      <Slider 
        min={0} 
        max={100} 
        step={1} 
        defaultValue={50} 
        onChange={handleSliderChange} 
      />
      <p>Current Slider Value: {sliderValue}</p>
    </div>
  );
};

export default SliderExample;
