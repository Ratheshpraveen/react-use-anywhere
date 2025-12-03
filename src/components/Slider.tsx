import React, { useState, useRef, useEffect, CSSProperties } from 'react';

interface SliderProps {
  min: number;
  max: number;
  value?: number;
  step?: number;
  onChange?: (value: number) => void;
  className?: string;
  style?: CSSProperties;
}

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  value: controlledValue,
  step = 1,
  onChange,
  className = '',
  style = {},
}) => {
  // Validate input values
  if (min >= max) {
    throw new Error('Min value must be less than max value');
  }

  // Ensure step is positive
  const validStep = Math.abs(step);

  // Internal state for uncontrolled component behavior
  const [internalValue, setInternalValue] = useState(() => {
    // Initialize with controlled value or midpoint
    const initialValue = controlledValue ?? (min + max) / 2;
    return Math.min(Math.max(initialValue, min), max);
  });

  // Ref for the slider track
  const trackRef = useRef<HTMLDivElement>(null);

  // Determine the current value (prioritize controlled value)
  const currentValue = controlledValue ?? internalValue;

  // Calculate percentage for slider thumb position
  const percentage = ((currentValue - min) / (max - min)) * 100;

  const handleChange = (newValue: number) => {
    // Snap to step
    const snappedValue = Math.round(newValue / validStep) * validStep;
    
    // Ensure value is within min and max
    const constrainedValue = Math.min(Math.max(snappedValue, min), max);

    // Update internal state if uncontrolled
    if (controlledValue === undefined) {
      setInternalValue(constrainedValue);
    }

    // Call onChange if provided
    onChange?.(constrainedValue);
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;

    const trackRect = trackRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - trackRect.left;
    const trackWidth = trackRect.width;
    
    const newValue = min + ((clickPosition / trackWidth) * (max - min));
    handleChange(newValue);
  };

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startX = e.clientX;
    const startValue = currentValue;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!trackRef.current) return;

      const trackRect = trackRef.current.getBoundingClientRect();
      const moveDelta = moveEvent.clientX - startX;
      const trackWidth = trackRect.width;
      
      const valueChange = ((moveDelta / trackWidth) * (max - min));
      const newValue = startValue + valueChange;
      
      handleChange(newValue);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div 
      className={`slider-container ${className}`} 
      style={{ 
        width: '100%', 
        position: 'relative', 
        height: '20px', 
        ...style 
      }}
    >
      <div 
        ref={trackRef}
        className="slider-track"
        onClick={handleTrackClick}
        style={{
          width: '100%',
          height: '4px',
          backgroundColor: '#e0e0e0',
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          borderRadius: '2px',
          cursor: 'pointer',
        }}
      >
        <div 
          className="slider-track-fill"
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: '#3f51b5',
            position: 'absolute',
            left: '0',
          }}
        />
      </div>
      <div 
        className="slider-thumb"
        onMouseDown={handleDragStart}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={currentValue}
        tabIndex={0}
        style={{
          position: 'absolute',
          left: `${percentage}%',
          transform: 'translate(-50%, -50%)',
          top: '50%',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: '#3f51b5',
          cursor: 'grab',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      />
    </div>
  );
};

export default Slider;
