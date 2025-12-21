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

import TopNavBar from '../components/TopNavBar';
import HeroPanel from '../components/HeroPanel';
import SummaryCards from '../components/SummaryCards';
import DataTable from '../components/DataTable';

interface DashboardProps {
  onThemeToggle: () => void;
  currentThemeMode: 'light' | 'dark';
}

const Dashboard: React.FC<DashboardProps> = ({ 
  onThemeToggle, 
  currentThemeMode 
}) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <TopNavBar />
      
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* Theme Toggle Button */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          mb: 2 
        }}>
          <Tooltip 
            title={`Switch to ${currentThemeMode === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            <IconButton onClick={onThemeToggle}>
              {currentThemeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
        </Box>

        <Grid container spacing={3}>
          {/* Hero Panel */}
          <Grid item xs={12}>
            <HeroPanel />
          </Grid>

          {/* Summary Cards */}
          <Grid item xs={12}>
            <SummaryCards />
          </Grid>

          {/* Data Table */}
          <Grid item xs={12}>
            <DataTable />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
