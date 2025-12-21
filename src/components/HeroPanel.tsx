import React from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  useTheme, 
  useMediaQuery 
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Mock data for achievements and charts
const achievementData = [
  { label: 'Projects Completed', value: 24 },
  { label: 'Tasks Finished', value: 156 },
  { label: 'Hours Worked', value: 320 }
];

const chartData = [
  { month: 'Jan', projects: 4 },
  { month: 'Feb', projects: 7 },
  { month: 'Mar', projects: 5 },
  { month: 'Apr', projects: 9 },
  { month: 'May', projects: 6 },
  { month: 'Jun', projects: 8 }
];

const HeroPanel: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* Summary Statistics */}
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Dashboard Overview
          </Typography>
        </Grid>

        {/* Achievement Stats */}
        <Grid item xs={12} container spacing={2}>
          {achievementData.map((stat) => (
            <Grid item xs={12} sm={4} key={stat.label}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{stat.label}</Typography>
                  <Typography variant="h4" color="primary">
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Data Visualization */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Project Progress
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="projects" 
                    stroke={theme.palette.primary.main} 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HeroPanel;
