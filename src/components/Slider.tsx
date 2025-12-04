import React, { useState, useCallback, useRef, useEffect } from 'react';

interface SliderProps {
  /**
   * The minimum value of the slider
   */
  min?: number;

  /**
   * The maximum value of the slider
   */
  max?: number;

  /**
   * The initial value of the slider
   */
  defaultValue?: number;

  /**
   * The step increment for the slider
   */
  step?: number;

  /**
   * Callback function triggered when the slider value changes
   */
  onChange?: (value: number) => void;

  /**
   * Aria label for accessibility
   */
  'aria-label'?: string;

  /**
   * Custom class name for styling
   */
  className?: string;

  /**
   * Disable the slider interaction
   */
  disabled?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  defaultValue,
  step = 1,
  onChange,
  'aria-label': ariaLabel = 'Slider',
  className = '',
  disabled = false,
}) => {
  // Validate input parameters
  if (min >= max) {
    throw new Error('Slider: min value must be less than max value');
  }

  // Ensure default value is within min and max range
  const initialValue = defaultValue !== undefined
    ? Math.min(Math.max(defaultValue, min), max)
    : min;

  const [value, setValue] = useState(initialValue);
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleChange = useCallback((newValue: number) => {
    // Round to the nearest step
    const roundedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.min(Math.max(roundedValue, min), max);

    setValue(clampedValue);
    onChange?.(clampedValue);
  }, [min, max, step, onChange]);

  const calculateValueFromPosition = useCallback((clientX: number) => {
    if (!sliderRef.current || !trackRef.current) return value;

    const track = trackRef.current;
    const trackRect = track.getBoundingClientRect();
    const trackWidth = trackRect.width;
    const trackStart = trackRect.left;

    const percentage = (clientX - trackStart) / trackWidth;
    const newValue = min + percentage * (max - min);

    return newValue;
  }, [min, max, value]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newValue = calculateValueFromPosition(moveEvent.clientX);
      handleChange(newValue);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    // Initial value update
    const newValue = calculateValueFromPosition(e.clientX);
    handleChange(newValue);
  }, [calculateValueFromPosition, handleChange, disabled]);

  const getTrackPercentage = () => {
    return ((value - min) / (max - min)) * 100;
  };

  return (
    <div
      ref={sliderRef}
      className={`slider ${className} ${disabled ? 'slider--disabled' : ''}`}
      aria-disabled={disabled}
    >
      <div
        ref={trackRef}
        className="slider__track"
        onMouseDown={handleMouseDown}
        role="slider"
        aria-label={ariaLabel}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-orientation="horizontal"
        tabIndex={disabled ? -1 : 0}
      >
        <div
          className="slider__progress"
          style={{ width: `${getTrackPercentage()}%` }}
        />
        <div
          className="slider__thumb"
          style={{ left: `${getTrackPercentage()}%` }}
        />
      </div>
    </div>
  );
};

export default Slider;
