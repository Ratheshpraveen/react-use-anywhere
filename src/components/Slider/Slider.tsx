import React, { useState, useRef, useEffect } from 'react';
import './Slider.css';

interface SliderProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({
  value: controlledValue,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  orientation = 'horizontal',
  disabled = false,
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState(
    controlledValue ?? min
  );
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  // Use controlled or uncontrolled value
  const value = controlledValue ?? internalValue;

  const handleChange = (newValue: number) => {
    // Ensure value is within min and max
    const clampedValue = Math.min(Math.max(newValue, min), max);
    
    // Round to nearest step
    const roundedValue = Math.round(clampedValue / step) * step;

    if (controlledValue === undefined) {
      setInternalValue(roundedValue);
    }

    onChange?.(roundedValue);
  };

  const calculatePositionPercentage = () => {
    return ((value - min) / (max - min)) * 100;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;

    const slider = sliderRef.current;
    if (!slider) return;

    const updateValue = (clientX: number, clientY: number) => {
      const rect = slider.getBoundingClientRect();
      let newValue;

      if (orientation === 'horizontal') {
        const percentage = (clientX - rect.left) / rect.width;
        newValue = min + percentage * (max - min);
      } else {
        const percentage = 1 - (clientY - rect.top) / rect.height;
        newValue = min + percentage * (max - min);
      }

      handleChange(newValue);
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      updateValue(moveEvent.clientX, moveEvent.clientY);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Initial update
    updateValue(e.clientX, e.clientY);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        handleChange(value - step);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        handleChange(value + step);
        break;
      case 'Home':
        handleChange(min);
        break;
      case 'End':
        handleChange(max);
        break;
    }
  };

  return (
    <div
      ref={sliderRef}
      className={`slider ${orientation} ${disabled ? 'disabled' : ''} ${className}`}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-orientation={orientation}
      tabIndex={disabled ? -1 : 0}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
    >
      <div 
        ref={thumbRef}
        className="slider-thumb"
        style={{
          [orientation === 'horizontal' ? 'left' : 'bottom']: `${calculatePositionPercentage()}%`
        }}
      />
      <div 
        className="slider-track"
        style={{
          [orientation === 'horizontal' ? 'width' : 'height']: `${calculatePositionPercentage()}%`
        }}
      />
    </div>
  );
};

export default Slider;
