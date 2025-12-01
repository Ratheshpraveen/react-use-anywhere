import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const Slider = ({
  value: initialValue = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className = '',
  style = {},
  ariaLabel = 'Slider',
}) => {
  const [value, setValue] = useState(initialValue);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  // Ensure value is within min and max bounds
  const constrainValue = (val) => {
    return Math.min(Math.max(val, min), max);
  };

  // Handle value change
  const handleChange = (newValue) => {
    const constrainedValue = constrainValue(newValue);
    setValue(constrainedValue);
    if (onChange) {
      onChange(constrainedValue);
    }
  };

  // Calculate percentage for slider thumb position
  const calculatePercentage = () => {
    return ((value - min) / (max - min)) * 100;
  };

  // Mouse event handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const slider = sliderRef.current;
    if (!slider) return;

    const rect = slider.getBoundingClientRect();
    const percentage = ((e.clientX - rect.left) / rect.width) * 100;
    const newValue = min + (max - min) * (percentage / 100);
    
    // Snap to step
    const snappedValue = Math.round(newValue / step) * step;
    handleChange(snappedValue);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Keyboard event handler for accessibility
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        handleChange(value - step);
        break;
      case 'ArrowRight':
        handleChange(value + step);
        break;
      default:
        break;
    }
  };

  // Cleanup event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div 
      ref={sliderRef}
      className={`slider-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '20px',
        ...style,
      }}
    >
      <div 
        role="slider"
        aria-label={ariaLabel}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        tabIndex={0}
        className="slider-track"
        style={{
          width: '100%',
          height: '4px',
          backgroundColor: '#ddd',
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        <div 
          className="slider-fill"
          style={{
            width: `${calculatePercentage()}%`,
            height: '100%',
            backgroundColor: '#007bff',
            position: 'absolute',
            left: 0,
          }}
        />
        <div 
          className="slider-thumb"
          onMouseDown={handleMouseDown}
          onKeyDown={handleKeyDown}
          role="presentation"
          style={{
            position: 'absolute',
            left: `${calculatePercentage()}%`,
            transform: 'translateX(-50%)',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: '#007bff',
            cursor: 'pointer',
            top: '50%',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}
        />
      </div>
    </div>
  );
};

Slider.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
  ariaLabel: PropTypes.string,
};

export default Slider;
