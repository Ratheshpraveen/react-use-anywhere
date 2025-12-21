import React from 'react';
import { 
  Container, 
  Box, 
  ThemeProvider, 
  createTheme 
} from '@mui/material';
import TopNavBar from '../components/TopNavBar';
import HeroPanel from '../components/HeroPanel';
import SummaryCards from '../components/SummaryCards';
import EntriesTable from '../components/EntriesTable';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

const Dashboard: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        backgroundColor: '#f4f6f8'
      }}>
        <TopNavBar />
        
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <HeroPanel />
          <SummaryCards />
          <EntriesTable />
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
