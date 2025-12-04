import React, { useState, useEffect } from 'react';
import './Slider.css';

const Slider = ({ 
  value: initialValue, 
  min = 0, 
  max = 100, 
  onChange, 
  step = 1,
  ...props 
}) => {
  // Validate and sanitize initial value
  const sanitizeValue = (val) => {
    // Ensure value is within min and max range
    const clampedValue = Math.min(Math.max(val, min), max);
    // Round to nearest step
    return Math.round((clampedValue - min) / step) * step + min;
  };

  const [value, setValue] = useState(() => sanitizeValue(initialValue || min));

  // Update local state if external value changes
  useEffect(() => {
    if (initialValue !== undefined) {
      setValue(sanitizeValue(initialValue));
    }
  }, [initialValue, min, max, step]);

  const handleChange = (e) => {
    const newValue = Number(e.target.value);
    const sanitizedValue = sanitizeValue(newValue);
    
    setValue(sanitizedValue);
    
    // Call onChange if provided
    if (onChange) {
      onChange(sanitizedValue);
    }
  };

  return (
    <div className="slider-container">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={handleChange}
        className="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        {...props}
      />
      <span className="slider-value">{value}</span>
    </div>
  );
};

export default Slider;
