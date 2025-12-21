import React from 'react';
import { 
  Container, 
  ThemeProvider, 
  CssBaseline, 
  Box 
} from '@mui/material';
import TopNavBar from '../components/TopNavBar';
import HeroPanel from '../components/HeroPanel';
import SummaryCards from '../components/SummaryCards';
import EntriesTable from '../components/EntriesTable';
import theme from '../theme';

const Dashboard: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TopNavBar />
      <Container maxWidth="xl">
        <Box sx={{ mt: 3 }}>
          <HeroPanel />
          <SummaryCards />
          <EntriesTable />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Dashboard;
