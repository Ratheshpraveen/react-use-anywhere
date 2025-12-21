import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TopNavBar from './components/TopNavBar';

// Optional: Create a custom theme
const theme = createTheme({
  palette: {
    mode: 'light', // or 'dark'
  },
});

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TopNavBar />
        {/* Other dashboard components will go here */}
      </ThemeProvider>
    </Router>
  );
};

export default App;
