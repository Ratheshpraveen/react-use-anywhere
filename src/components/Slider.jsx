import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Slider.css';

const Slider = ({ 
  min = 0, 
  max = 100, 
  step = 1, 
  defaultValue, 
  onChange,
  'aria-label': ariaLabel = 'Slider'
}) => {
  // Use defaultValue if provided, otherwise use min
  const [value, setValue] = useState(defaultValue !== undefined ? defaultValue : min);

  const handleChange = (e) => {
    const newValue = Number(e.target.value);
    setValue(newValue);
    
    // Call onChange callback if provided
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        setValue(Math.max(min, value - step));
        break;
      case 'ArrowRight':
        setValue(Math.min(max, value + step));
        break;
      default:
        break;
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
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
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
  onChange: PropTypes.func,
  'aria-label': PropTypes.string
};

export default Slider;
