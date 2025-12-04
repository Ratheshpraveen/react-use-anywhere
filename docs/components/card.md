# Card Component

## Purpose
The Card component provides a flexible and responsive container for displaying content with various styling options.

## CSS Classes and Modifiers

### Base Class
- `.card`: Default card styling

### Modifiers
- `.card--elevated`: Adds a more pronounced shadow
- `.card--flat`: Removes shadow, adds a light border
- `.card--outlined`: Adds a border without shadow

### Elements
- `.card__header`: Container for card header content
- `.card__title`: Styling for card title
- `.card__content`: Main content area
- `.card__footer`: Footer section of the card

## Usage Examples

### Basic Card
```html
<div class="card">
  <div class="card__content">
    Basic card content
  </div>
</div>
```

### Elevated Card
```html
<div class="card card--elevated">
  <div class="card__header">
    <h2 class="card__title">Elevated Card</h2>
  </div>
  <div class="card__content">
    Content with more prominent shadow
  </div>
</div>
```

### Outlined Card
```html
<div class="card card--outlined">
  <div class="card__content">
    Card with border outline
  </div>
  <div class="card__footer">
    Footer content
  </div>
</div>
```

## Responsive Behavior
- Full width on mobile (up to 768px)
- Maximum width of 400px on larger screens
- Centered on smaller screens
- Smooth transition effects
