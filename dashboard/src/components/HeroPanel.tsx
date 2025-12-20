import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box 
} from '@mui/material';

const HeroPanel: React.FC = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Dashboard Overview
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="h6">Total Projects</Typography>
              <Typography variant="h4" color="primary">42</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="h6">Active Users</Typography>
              <Typography variant="h4" color="primary">256</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="h6">Revenue</Typography>
              <Typography variant="h4" color="primary">$124,567</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default HeroPanel;
