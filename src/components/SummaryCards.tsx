import React from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box 
} from '@mui/material';
import { 
  AttachMoney as MoneyIcon, 
  Timeline as TimelineIcon, 
  CheckCircle as CheckIcon, 
  Error as ErrorIcon 
} from '@mui/icons-material';

// Placeholder data for summary cards
const summaryCardsData = [
  {
    title: 'Total Revenue',
    value: '$45,230',
    icon: <MoneyIcon color="primary" />,
    change: '+12.5%',
    positive: true,
  },
  {
    title: 'Project Progress',
    value: '76%',
    icon: <TimelineIcon color="secondary" />,
    change: '+3% from last month',
    positive: true,
  },
  {
    title: 'Completed Tasks',
    value: '156',
    icon: <CheckIcon color="success" />,
    change: '+22 this week',
    positive: true,
  },
  {
    title: 'Pending Issues',
    value: '8',
    icon: <ErrorIcon color="error" />,
    change: '-2 from last week',
    positive: false,
  },
];

const SummaryCards: React.FC = () => {
  return (
    <Grid container spacing={3} sx={{ padding: 3 }}>
      {summaryCardsData.map((card) => (
        <Grid item xs={12} sm={6} md={3} key={card.title}>
          <Card>
            <CardContent>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}
              >
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {card.title}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {card.value}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color={card.positive ? 'success.main' : 'error.main'}
                  >
                    {card.change}
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    fontSize: 40, 
                    opacity: 0.7,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {card.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCards;
