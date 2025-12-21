import React from 'react';
import { 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  Box 
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
const achievementsData = [
  { label: 'Projects Completed', value: 24 },
  { label: 'Total Revenue', value: '$128,450' },
  { label: 'Client Satisfaction', value: '95%' }
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
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* Achievements Section */}
        <Grid item xs={12} md={4}>
          <Typography variant="h5" gutterBottom>
            Quick Achievements
          </Typography>
          <Grid container spacing={2}>
            {achievementsData.map((achievement, index) => (
              <Grid item xs={12} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1">{achievement.label}</Typography>
                    <Typography variant="h6" color="primary">
                      {achievement.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Project Chart */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            Monthly Project Progress
          </Typography>
          <Card variant="outlined">
            <CardContent>
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
      </Grid>
    </Box>
  );
};

export default HeroPanel;
