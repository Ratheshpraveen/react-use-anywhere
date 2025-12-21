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
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

// Mock data for charts (replace with actual data)
const projectProgressData = [
  { name: 'Completed', value: 65 },
  { name: 'In Progress', value: 25 },
  { name: 'Pending', value: 10 }
];

const monthlyRevenueData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 4500 },
  { month: 'May', revenue: 6000 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const HeroPanel: React.FC = () => {
  return (
    <Grid container spacing={3} sx={{ padding: 3 }}>
      {/* Summary Section */}
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Dashboard Overview
        </Typography>
      </Grid>

      {/* Achievement Stats Cards */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Project Progress</Typography>
            <PieChart width={300} height={250}>
              <Pie
                data={projectProgressData}
                cx={150}
                cy={125}
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {projectProgressData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6">Monthly Revenue</Typography>
            <BarChart
              width={500}
              height={250}
              data={monthlyRevenueData}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </CardContent>
        </Card>
      </Grid>

      {/* Key Metrics */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">Total Projects</Typography>
                <Typography variant="h5" color="primary">42</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">Active Users</Typography>
                <Typography variant="h5" color="primary">256</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">Revenue This Month</Typography>
                <Typography variant="h5" color="primary">$45,000</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HeroPanel;
