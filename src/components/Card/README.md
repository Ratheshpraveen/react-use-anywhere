# Card Component

A flexible and customizable Card component for React applications.

## Props

| Prop      | Type                   | Description                                | Default   |
|-----------|------------------------|--------------------------------------------|-----------| 
| title     | `string`               | Card title                                 | `undefined` |
| content   | `React.ReactNode`      | Card main content                          | `undefined` |
| image     | `string`               | URL of the card image                      | `undefined` |
| actions   | `React.ReactNode`      | Action buttons or elements                 | `undefined` |
| className | `string`               | Additional CSS classes                     | `''`        |
| variant   | `'basic'|'elevated'|'outlined'` | Card style variant             | `'basic'`    |

## Usage Examples

```tsx
// Basic Card
<Card 
  title="Welcome" 
  content="This is a simple card component" 
/>

// Card with Image
<Card 
  title="Landscape" 
  image="/path/to/image.jpg" 
  content="Beautiful scenery" 
/>

// Card with Actions
<Card 
  title="User Profile" 
  content="John Doe" 
  actions={
    <>
      <Button>Edit</Button>
      <Button variant="secondary">Close</Button>
    </>
  }
/>

// Different Variants
<Card variant="elevated" title="Elevated Card" />
<Card variant="outlined" title="Outlined Card" />
```
