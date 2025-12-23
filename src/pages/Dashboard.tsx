import React from 'react';
import { 
  Container, 
  Grid, 
  Box, 
  IconButton, 
  Tooltip 
} from '@mui/material';
import { 
  Brightness4 as DarkModeIcon, 
  Brightness7 as LightModeIcon 
} from '@mui/icons-material';

// Import components
import TopNavBar from '../components/TopNavBar';
import HeroPanel from '../components/HeroPanel';
import SummaryCards from '../components/SummaryCards';
import EntriesTable from '../components/EntriesTable';

// Dashboard props interface
interface DashboardProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  isDarkMode, 
  onToggleTheme 
}) => {
  return (
    <Box sx={{ 
      backgroundColor: 'background.default', 
      minHeight: '100vh',
      pb: 4 
    }}>
      {/* Theme Toggle Button */}
      <Tooltip title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}>
        <IconButton 
          onClick={onToggleTheme} 
          color="primary"
          sx={{ 
            position: 'fixed', 
            top: 16, 
            right: 16, 
            zIndex: 1200 
          }}
        >
          {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Tooltip>

      {/* Top Navigation Bar */}
      <TopNavBar />

      {/* Main Dashboard Container */}
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* Hero Panel */}
          <Grid item xs={12}>
            <HeroPanel />
          </Grid>

          {/* Summary Cards */}
          <Grid item xs={12}>
            <SummaryCards />
          </Grid>

          {/* Entries Table */}
          <Grid item xs={12}>
            <EntriesTable />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
