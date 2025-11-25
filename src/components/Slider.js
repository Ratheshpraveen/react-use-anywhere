import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const SliderContainer = styled.div`
  width: 100%;
  margin: 20px 0;
`;

const SliderInput = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 10px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
  }
`;

const ValueDisplay = styled.div`
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
  color: #333;
`;

const Slider = ({
  min = 0,
  max = 100,
  step = 1,
  initialValue,
  onChange,
  showValue = true,
}) => {
  const [value, setValue] = useState(initialValue || min);

  const handleChange = (event) => {
    const newValue = Number(event.target.value);
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <SliderContainer>
      <SliderInput
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
      />
      {showValue && <ValueDisplay>{value}</ValueDisplay>}
    </SliderContainer>
  );
};

Slider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  initialValue: PropTypes.number,
  onChange: PropTypes.func,
  showValue: PropTypes.bool,
};

export default Slider;
