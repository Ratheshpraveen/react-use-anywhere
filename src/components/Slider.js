import React from 'react';
import PropTypes from 'prop-types';

const Slider = ({ 
  value, 
  min, 
  max, 
  onChange, 
  step = 1 
}) => {
  const handleChange = (event) => {
    const newValue = Number(event.target.value);
    onChange(newValue);
  };

  return (
    <div className="slider-container">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        step={step}
        className="slider"
      />
      <span className="slider-value">{value}</span>
    </div>
  );
};

Slider.propTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  step: PropTypes.number
};

export default Slider;
