import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route 
} from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Customize primary color
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* Add more routes as needed */}
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
