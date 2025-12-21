import React from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  Container 
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Mock data for achievements and chart
const achievementData = [
  { label: 'Projects Completed', value: 24 },
  { label: 'Tasks Finished', value: 156 },
  { label: 'Hours Worked', value: 480 }
];

const chartData = [
  { month: 'Jan', projects: 4 },
  { month: 'Feb', projects: 6 },
  { month: 'Mar', projects: 8 },
  { month: 'Apr', projects: 5 },
  { month: 'May', projects: 7 },
  { month: 'Jun', projects: 9 }
];

const HeroPanel: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ flexGrow: 1, my: 4 }}>
        <Grid container spacing={3}>
          {/* Achievement Stats */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Achievement Stats
                </Typography>
                {achievementData.map((stat) => (
                  <Box key={stat.label} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">
                      {stat.label}
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {stat.value}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Data Visualization */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Monthly Project Progress
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="projects" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Summary Statistics */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Project Overview
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1">Total Revenue</Typography>
                    <Typography variant="h4" color="primary">
                      $124,567
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1">Active Projects</Typography>
                    <Typography variant="h4" color="secondary">
                      12
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1">Team Productivity</Typography>
                    <Typography variant="h4" color="success.main">
                      92%
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HeroPanel;
