import React from 'react';
import { 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { 
  AttachMoney as MoneyIcon, 
  People as PeopleIcon, 
  ShoppingCart as CartIcon 
} from '@mui/icons-material';

// Summary Card Component
const SummaryCard: React.FC<{
  title: string, 
  value: string, 
  icon: React.ReactNode
}> = ({ title, value, icon }) => (
  <Card>
    <CardContent>
      <Grid container spacing={2} alignItems="center">
        <Grid item>{icon}</Grid>
        <Grid item>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="h4">{value}</Typography>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

// Hero Panel Component
const HeroPanel: React.FC = () => (
  <Box 
    sx={{ 
      backgroundColor: 'primary.main', 
      color: 'white', 
      p: 3, 
      borderRadius: 2 
    }}
  >
    <Typography variant="h4">Welcome to Your Dashboard</Typography>
    <Typography variant="subtitle1">
      Here's an overview of your current performance
    </Typography>
  </Box>
);

// Sample Data Table
const sampleData = [
  { id: 1, name: 'John Doe', revenue: '$5,000', status: 'Active' },
  { id: 2, name: 'Jane Smith', revenue: '$7,500', status: 'Active' },
  { id: 3, name: 'Bob Johnson', revenue: '$3,200', status: 'Inactive' },
];

const Dashboard: React.FC = () => {
  return (
    <Grid container spacing={3}>
      {/* Hero Panel */}
      <Grid item xs={12}>
        <HeroPanel />
      </Grid>

      {/* Summary Cards */}
      <Grid item xs={12} md={4}>
        <SummaryCard 
          title="Total Revenue" 
          value="$45,230" 
          icon={<MoneyIcon color="primary" />} 
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <SummaryCard 
          title="Total Customers" 
          value="1,234" 
          icon={<PeopleIcon color="primary" />} 
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <SummaryCard 
          title="Total Orders" 
          value="456" 
          icon={<CartIcon color="primary" />} 
        />
      </Grid>

      {/* Data Table */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Performance
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Revenue</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sampleData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.revenue}</TableCell>
                      <TableCell>{row.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Dashboard;
