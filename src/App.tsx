import React from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Container 
} from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopNavBar from './components/TopNavBar';
import HeroPanel from './components/HeroPanel';

// Create a custom theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Adjust primary color as needed
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <HeroPanel />
      {/* Other dashboard components will be added here */}
    </Container>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <TopNavBar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
