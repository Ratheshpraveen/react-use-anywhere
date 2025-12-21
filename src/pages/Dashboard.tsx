import React from 'react';
import { Container, Box } from '@mui/material';
import TopNavBar from '../components/TopNavBar';
import HeroPanel from '../components/HeroPanel';
import SummaryCards from '../components/SummaryCards';
import EntriesTable from '../components/EntriesTable';

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopNavBar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <HeroPanel />
        <SummaryCards />
        <EntriesTable />
      </Container>
    </Box>
  );
};

export default Dashboard;
