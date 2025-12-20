import React from 'react';
import { Container, Grid } from '@mui/material';
import TopNavBar from '../components/TopNavBar';
import HeroPanel from '../components/HeroPanel';
import SummaryCards from '../components/SummaryCards';
import DataTable from '../components/DataTable';

const Dashboard: React.FC = () => {
  return (
    <>
      <TopNavBar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <HeroPanel />
          </Grid>
          <Grid item xs={12}>
            <SummaryCards />
          </Grid>
          <Grid item xs={12}>
            <DataTable />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Dashboard;
