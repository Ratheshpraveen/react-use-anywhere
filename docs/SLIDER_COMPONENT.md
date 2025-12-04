# Slider Component

## Overview
A reusable and customizable Slider component for React applications.

## Features
- Supports horizontal and vertical orientation
- Configurable min and max values
- Optional step increments
- Customizable styling
- Accessibility considerations

## Props
- `value`: Current value of the slider
- `onChange`: Callback function when slider value changes
- `min`: Minimum value (default: 0)
- `max`: Maximum value (default: 100)
- `step`: Increment step (default: 1)
- `orientation`: 'horizontal' or 'vertical' (default: 'horizontal')
- `disabled`: Disable slider interaction (default: false)

## Usage Example
```typescript
<Slider 
  value={sliderValue}
  onChange={handleSliderChange}
  min={0}
  max={100}
  step={5}
/>
```

## Accessibility
- Supports keyboard interactions
- ARIA attributes for screen readers
- Follows WCAG guidelines for form controls
