import React, { useState } from 'react';

interface SliderProps {
  /**
   * Minimum value for the slider
   */
  min?: number;

  /**
   * Maximum value for the slider
   */
  max?: number;

  /**
   * Current value of the slider
   */
  value?: number;

  /**
   * Callback function when slider value changes
   */
  onChange?: (value: number) => void;

  /**
   * Step size for slider increments
   */
  step?: number;

  /**
   * Custom class name for styling
   */
  className?: string;
}

/**
 * Slider Component
 * A reusable and configurable slider input component
 */
export const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  value: controlledValue,
  onChange,
  step = 1,
  className = '',
}) => {
  // Use controlled or uncontrolled mode
  const [internalValue, setInternalValue] = useState(controlledValue ?? min);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    
    // Update internal state if no external onChange is provided
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }

    // Call external onChange if provided
    onChange?.(newValue);
  };

  // Determine the current value (prioritize controlled value)
  const currentValue = controlledValue ?? internalValue;

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
        aria-label="Slider"
      />
      <output className="slider-value">{currentValue}</output>
    </div>
  );
};
