import React from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Icon 
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon, 
  AttachMoney as MoneyIcon, 
  People as PeopleIcon 
} from '@mui/icons-material';

// Define interface for summary card data
interface SummaryCardData {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: number;
}

const summaryCardsData: SummaryCardData[] = [
  {
    title: 'Total Revenue',
    value: '$24,500',
    icon: <MoneyIcon color="primary" />,
    change: 15.5
  },
  {
    title: 'New Users',
    value: '1,250',
    icon: <PeopleIcon color="secondary" />,
    change: 12.3
  },
  {
    title: 'Growth Rate',
    value: '45.2%',
    icon: <TrendingUpIcon color="success" />,
    change: 8.7
  }
];

const SummaryCards: React.FC = () => {
  return (
    <Grid container spacing={3}>
      {summaryCardsData.map((card, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="h4" color="textPrimary">
                    {card.value}
                  </Typography>
                </Box>
                <Box>
                  {card.icon}
                </Box>
              </Box>
              <Box mt={2} display="flex" alignItems="center">
                <TrendingUpIcon 
                  color={card.change > 0 ? 'success' : 'error'} 
                  fontSize="small" 
                />
                <Typography 
                  variant="body2" 
                  color={card.change > 0 ? 'success.main' : 'error.main'}
                  ml={1}
                >
                  {card.change > 0 ? '+' : ''}{card.change}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCards;
