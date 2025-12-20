import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import { createTheme } from '@mui/material/styles';
import Dashboard from './pages/Dashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Adjust to your preferred primary color
    },
    secondary: {
      main: '#dc004e', // Adjust to your preferred secondary color
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Dashboard />
      </Router>
    </ThemeProvider>
  );
}

export default App;
