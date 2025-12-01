import React, { useState } from 'react';
import Slider from '../components/Slider';

const SliderUsage: React.FC = () => {
  const [value, setValue] = useState(50);

  return (
    <div>
      <h2>Slider Example</h2>
      <Slider
        value={value}
        min={0}
        max={100}
        onChange={setValue}
        step={5}
        ariaLabel="Volume Slider"
      />
      <p>Current Value: {value}</p>

      <h3>Disabled Slider</h3>
      <Slider
        value={25}
        min={0}
        max={100}
        onChange={() => {}}
        disabled
        ariaLabel="Disabled Slider"
      />
    </div>
  );
};

export default SliderUsage;
