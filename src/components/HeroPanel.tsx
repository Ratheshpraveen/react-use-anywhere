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

// Placeholder data for achievement stats and chart
const achievementData = [
  { name: 'Projects', value: 24 },
  { name: 'Completed', value: 18 },
  { name: 'Pending', value: 6 }
];

const chartData = [
  { month: 'Jan', productivity: 65 },
  { month: 'Feb', productivity: 59 },
  { month: 'Mar', productivity: 80 },
  { month: 'Apr', productivity: 81 },
  { month: 'May', productivity: 56 },
  { month: 'Jun', productivity: 55 }
];

const HeroPanel: React.FC = () => {
  return (
    <Grid container spacing={3} sx={{ padding: 3 }}>
      {/* Summary Section */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Dashboard Summary</Typography>
            <Typography variant="body2">
              Welcome to your productivity dashboard. Track your progress and achievements.
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Achievement Stats */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Achievement Stats</Typography>
            <Grid container spacing={2}>
              {achievementData.map((stat) => (
                <Grid item xs={4} key={stat.name}>
                  <Box textAlign="center">
                    <Typography variant="h4">{stat.value}</Typography>
                    <Typography variant="caption">{stat.name}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Data Visualization */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Productivity Trend</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="productivity" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default HeroPanel;
