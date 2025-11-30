import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Slider.css'; // We'll create this CSS file next

const Slider = ({ 
  min = 0, 
  max = 100, 
  step = 1, 
  defaultValue, 
  onChange 
}) => {
  // If no defaultValue is provided, start at the minimum
  const [value, setValue] = useState(defaultValue !== undefined ? defaultValue : min);

  const handleChange = (e) => {
    const newValue = Number(e.target.value);
    setValue(newValue);
    
    // Call the onChange prop if provided
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="slider-container">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="slider"
      />
      <span className="slider-value">{value}</span>
    </div>
  );
};

Slider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  defaultValue: PropTypes.number,
  onChange: PropTypes.func
};

export default Slider;
