#!/bin/bash
# Create React project with TypeScript
npx create-react-app react-dashboard --template typescript

# Navigate to project directory
cd react-dashboard

# Install Material-UI core and icons
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

# Install React Router
npm install react-router-dom @types/react-router-dom

# Install additional libraries for charts
npm install recharts

# Optional: Install styled-components if needed
npm install styled-components @types/styled-components

# Create project structure
mkdir -p src/components src/pages src/utilities src/theme

# Print completion message
echo "React Dashboard project setup complete!"
