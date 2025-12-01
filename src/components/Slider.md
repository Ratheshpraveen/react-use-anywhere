# Slider Component

## Overview
The Slider component is a flexible and customizable range input component for React applications.

## Props
| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `value` | `number` | Yes | - | Current value of the slider |
| `min` | `number` | Yes | - | Minimum value of the slider |
| `max` | `number` | Yes | - | Maximum value of the slider |
| `onChange` | `(value: number) => void` | Yes | - | Callback function when slider value changes |
| `step` | `number` | No | `1` | Increment/decrement step for the slider |
| `disabled` | `boolean` | No | `false` | Disable the slider interaction |
| `className` | `string` | No | `''` | Additional CSS class for the slider container |
| `style` | `React.CSSProperties` | No | `undefined` | Inline styles for the slider container |
| `ariaLabel` | `string` | No | `'Slider'` | Accessibility label for the slider |

## Usage Example
```typescript
import React, { useState } from 'react';
import Slider from './Slider';

const MyComponent = () => {
  const [value, setValue] = useState(50);

  return (
    <Slider
      value={value}
      min={0}
      max={100}
      onChange={setValue}
      step={5}
    />
  );
};
```

## Styling
The slider is styled with a modern, clean design and includes hover and disabled states. You can customize its appearance by overriding the CSS classes:
- `.react-use-anywhere-slider`
- `.react-use-anywhere-slider-input`
- `.react-use-anywhere-slider-value`
