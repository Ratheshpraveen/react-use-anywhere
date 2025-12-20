import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Typography, 
  useTheme 
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
  { label: 'Client Satisfaction', value: '95%' },
];

const chartData = [
  { month: 'Jan', revenue: 4000, projects: 10 },
  { month: 'Feb', revenue: 3000, projects: 8 },
  { month: 'Mar', revenue: 5000, projects: 12 },
  { month: 'Apr', revenue: 4500, projects: 11 },
  { month: 'May', revenue: 6000, projects: 15 },
];

const HeroPanel: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* Achievements Cards */}
        {achievementsData.map((achievement, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card 
              elevation={3} 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center',
                textAlign: 'center',
                backgroundColor: theme.palette.background.paper
              }}
            >
              <CardContent>
                <Typography variant="h5" component="div">
                  {achievement.label}
                </Typography>
                <Typography variant="h4" color="primary">
                  {achievement.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Data Visualization */}
        <Grid item xs={12}>
          <Card elevation={3}>
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
                  <Bar dataKey="revenue" fill={theme.palette.primary.main} name="Revenue" />
                  <Bar dataKey="projects" fill={theme.palette.secondary.main} name="Projects" />
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
