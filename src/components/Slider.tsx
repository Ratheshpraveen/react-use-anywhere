import React from 'react';
import './Slider.css';

// Define the props interface for type checking
interface SliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  step?: number;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
}

const Slider: React.FC<SliderProps> = ({
  value,
  min,
  max,
  onChange,
  step = 1,
  disabled = false,
  className = '',
  style,
  ariaLabel = 'Slider'
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    onChange(newValue);
  };

  return (
    <div 
      className={`react-use-anywhere-slider ${className}`} 
      style={style}
    >
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        step={step}
        disabled={disabled}
        aria-label={ariaLabel}
        className="react-use-anywhere-slider-input"
      />
      <span className="react-use-anywhere-slider-value">
        {value}
      </span>
    </div>
  );
};

export default Slider;
