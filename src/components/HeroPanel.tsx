import React from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  useMediaQuery, 
  useTheme 
} from '@mui/material';
import { 
  PieChart, 
  Pie, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Mock data for achievement stats and charts
const achievementData = {
  projectCompletion: [
    { name: 'Completed', value: 65, fill: '#0088FE' },
    { name: 'In Progress', value: 25, fill: '#00C49F' },
    { name: 'Not Started', value: 10, fill: '#FFBB28' }
  ],
  monthlyProgress: [
    { month: 'Jan', progress: 40 },
    { month: 'Feb', progress: 60 },
    { month: 'Mar', progress: 50 },
    { month: 'Apr', progress: 75 },
    { month: 'May', progress: 65 }
  ]
};

interface HeroPanelProps {
  username?: string;
}

const HeroPanel: React.FC<HeroPanelProps> = ({ username = 'User' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={3}>
        {/* Welcome and Summary Section */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Welcome, {username}!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Here's an overview of your project progress and achievements.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Project Completion Pie Chart */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Project Completion
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={achievementData.projectCompletion}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  />
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Progress Bar Chart */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Progress
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={achievementData.monthlyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="progress" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Achievement Stats */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Total Projects</Typography>
                  <Typography variant="h4" color="primary">
                    24
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Completed Projects</Typography>
                  <Typography variant="h4" color="success.main">
                    15
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Pending Projects</Typography>
                  <Typography variant="h4" color="warning.main">
                    9
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HeroPanel;
