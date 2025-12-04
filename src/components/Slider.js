import React from 'react';
import PropTypes from 'prop-types';
import './Slider.css'; // We'll create a CSS file for custom styling

const Slider = ({ 
  value, 
  min, 
  max, 
  onChange, 
  step = 1, 
  className = '', 
  ...rest 
}) => {
  const handleChange = (e) => {
    const newValue = Number(e.target.value);
    onChange(newValue);
  };

  return (
    <div className={`slider-container ${className}`}>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
        className="slider"
        {...rest}
      />
      <div className="slider-value">{value}</div>
    </div>
  );
};

Slider.propTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  step: PropTypes.number,
  className: PropTypes.string
};

export default Slider;
