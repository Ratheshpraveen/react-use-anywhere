import React, { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';

// Import theme and components
import theme, { darkTheme } from './theme';
import Dashboard from './pages/Dashboard';

// Optional: Theme toggle component
const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : theme}>
      <CssBaseline /> {/* Normalize styles across browsers */}
      <Router>
        <Dashboard 
          isDarkMode={isDarkMode} 
          onToggleTheme={toggleTheme} 
        />
      </Router>
    </ThemeProvider>
  );
};

export default App;
