import React, { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import theme, { toggleThemeMode } from './theme';

function App() {
  const [currentTheme, setCurrentTheme] = useState(theme);

  const handleThemeToggle = () => {
    const newMode = currentTheme.palette.mode === 'light' ? 'dark' : 'light';
    setCurrentTheme(toggleThemeMode(newMode));
  };

  return (
    <ErrorBoundary>
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route 
              path="/" 
              element={
                <Dashboard 
                  onThemeToggle={handleThemeToggle} 
                  currentThemeMode={currentTheme.palette.mode} 
                />
              } 
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
