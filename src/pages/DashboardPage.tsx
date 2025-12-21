import React from 'react';
import { Container, Grid, Box } from '@mui/material';
import { TopNavBar } from '../components/Navigation/TopNavBar';
import { HeroPanel } from '../components/Dashboard/HeroPanel';
import { SummaryCards } from '../components/Dashboard/SummaryCards';
import { EntriesTable } from '../components/Dashboard/EntriesTable';
import { ThemeProvider } from '../theme/ThemeProvider';

const DashboardPage: React.FC = () => {
  return (
    <ThemeProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <TopNavBar />
        <Container maxWidth="xl" sx={{ mt: 4, flexGrow: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <HeroPanel />
            </Grid>
            <Grid item xs={12}>
              <SummaryCards />
            </Grid>
            <Grid item xs={12}>
              <EntriesTable />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default DashboardPage;
