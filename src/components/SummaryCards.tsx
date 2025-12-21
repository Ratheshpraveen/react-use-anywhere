import React from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box 
} from '@mui/material';
import ProjectIcon from '@mui/icons-material/Work';
import RevenueIcon from '@mui/icons-material/AttachMoney';
import UsersIcon from '@mui/icons-material/People';
import TasksIcon from '@mui/icons-material/CheckCircle';

interface SummaryCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ icon, title, value, color }) => (
  <Card sx={{ 
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'space-between' 
  }}>
    <CardContent>
      <Box 
        sx={{ 
          color: color, 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: 2 
        }}
      >
        {icon}
        <Typography variant="subtitle1" sx={{ marginLeft: 1 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" align="right">
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const SummaryCards: React.FC = () => {
  const cardData = [
    {
      icon: <ProjectIcon />,
      title: 'Total Projects',
      value: '24',
      color: '#3f51b5'
    },
    {
      icon: <RevenueIcon />,
      title: 'Revenue',
      value: '$45,230',
      color: '#4caf50'
    },
    {
      icon: <UsersIcon />,
      title: 'Team Members',
      value: '12',
      color: '#ff9800'
    },
    {
      icon: <TasksIcon />,
      title: 'Completed Tasks',
      value: '86%',
      color: '#f44336'
    }
  ];

  return (
    <Grid container spacing={3} sx={{ padding: 3 }}>
      {cardData.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <SummaryCard 
            icon={card.icon}
            title={card.title}
            value={card.value}
            color={card.color}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCards;
