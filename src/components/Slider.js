import React, { useState } from 'react';
import './Slider.css';

/**
 * Slider Component
 * A reusable, accessible slider input with customizable props
 */
const Slider = ({ 
  value: controlledValue, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1,
  'aria-label': ariaLabel = 'Slider',
  className = '',
  ...props 
}) => {
  // If no controlled value is provided, use internal state
  const [internalValue, setInternalValue] = useState(controlledValue || min);

  // Determine the current value (prioritize controlled value)
  const currentValue = controlledValue !== undefined 
    ? controlledValue 
    : internalValue;

  // Handle value change
  const handleChange = (event) => {
    const newValue = Number(event.target.value);
    
    // Update internal state if not controlled
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }

    // Call onChange prop if provided
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className={`slider-container ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onChange={handleChange}
        className="slider"
        aria-label={ariaLabel}
        {...props}
      />
      <output 
        className="slider-value" 
        htmlFor="slider"
      >
        {currentValue}
      </output>
    </div>
  );
};

export default Slider;
