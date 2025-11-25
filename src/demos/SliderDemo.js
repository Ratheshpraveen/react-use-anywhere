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
      <Slider
        min={0}
        max={100}
        step={1}
        initialValue={50}
        onChange={handleSliderChange}
        showValue={true}
      />
      <p>Current Slider Value: {sliderValue}</p>
    </div>
  );
};

export default SliderDemo;
