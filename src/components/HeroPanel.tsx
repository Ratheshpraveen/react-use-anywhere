import React from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
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

// Placeholder data for achievements and chart
const achievementsData = [
  { category: 'Projects', value: 24 },
  { category: 'Tasks Completed', value: 156 },
  { category: 'Team Members', value: 8 },
];

const chartData = [
  { month: 'Jan', projects: 4, tasks: 20 },
  { month: 'Feb', projects: 6, tasks: 35 },
  { month: 'Mar', projects: 5, tasks: 28 },
  { month: 'Apr', projects: 8, tasks: 45 },
];

const HeroPanel: React.FC = () => {
  return (
    <Grid container spacing={3} sx={{ padding: 3 }}>
      {/* Summary Section */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Project Summary
            </Typography>
            {achievementsData.map((item) => (
              <Box 
                key={item.category} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: 1 
                }}
              >
                <Typography>{item.category}</Typography>
                <Typography fontWeight="bold">{item.value}</Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* Achievement Stats */}
      <Grid item xs={12} md={8}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Monthly Performance
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="projects" fill="#8884d8" name="Projects" />
                <Bar dataKey="tasks" fill="#82ca9d" name="Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default HeroPanel;
