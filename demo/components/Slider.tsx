import React, { useState, useCallback, useRef } from 'react';
import { Logger } from '../services/logger';
import { useHookService } from '../../lib/hooks/useHookService';

// Slider component props interface
interface SliderProps {
  min: number;
  max: number;
  step: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  label?: string;
}

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step,
  defaultValue = min,
  onChange,
  label
}) => {
  // Use hook service for potential logging
  const hookService = useHookService();
  const logger = new Logger('Slider');

  // State for current value
  const [value, setValue] = useState<number>(defaultValue);
  const sliderRef = useRef<HTMLInputElement>(null);

  // Handle value change with validation
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    
    // Validate input range
    if (newValue >= min && newValue <= max) {
      setValue(newValue);
      
      // Log the change
      logger.log(`Slider value changed to: ${newValue}`);
      
      // Call onChange if provided
      onChange?.(newValue);
    }
  }, [min, max, onChange]);

  // Handle keyboard events for accessibility
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    const currentValue = Number(sliderRef.current?.value);
    
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        setValue(Math.max(min, currentValue - step));
        break;
      case 'ArrowRight':
        event.preventDefault();
        setValue(Math.min(max, currentValue + step));
        break;
    }
  }, [min, max, step]);

  return (
    <div 
      className="slider-container" 
      style={{
        width: '100%',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {label && <label 
        htmlFor="slider" 
        style={{ 
          marginBottom: '10px', 
          fontWeight: 'bold' 
        }}
      >
        {label}
      </label>}
      
      <input 
        ref={sliderRef}
        type="range"
        id="slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        style={{
          width: '100%',
          cursor: 'pointer',
          appearance: 'none',
          backgroundColor: '#e0e0e0',
          outline: 'none',
          borderRadius: '5px',
          height: '10px',
          transition: 'background 0.2s ease'
        }}
      />
      
      <div 
        style={{ 
          marginTop: '10px', 
          fontWeight: 'bold' 
        }}
      >
        Current Value: {value}
      </div>
    </div>
  );
};

export default Slider;
