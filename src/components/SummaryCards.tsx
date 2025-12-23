import React from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  CardActionArea 
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon, 
  AttachMoney as AttachMoneyIcon, 
  People as PeopleIcon, 
  ShoppingCart as ShoppingCartIcon 
} from '@mui/icons-material';

// Interface for Summary Card Props
interface SummaryCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

// Sample data for summary cards
const summaryCardsData: SummaryCardProps[] = [
  {
    title: 'Total Revenue',
    value: '$24,500',
    change: 15.5,
    icon: <AttachMoneyIcon />,
    color: 'primary.main'
  },
  {
    title: 'New Customers',
    value: '1,250',
    change: 12.3,
    icon: <PeopleIcon />,
    color: 'success.main'
  },
  {
    title: 'Total Sales',
    value: '5,420',
    change: 8.7,
    icon: <ShoppingCartIcon />,
    color: 'info.main'
  },
  {
    title: 'Growth Rate',
    value: '25.5%',
    change: 20.1,
    icon: <TrendingUpIcon />,
    color: 'warning.main'
  }
];

// Reusable Summary Card Component
const SummaryCard: React.FC<SummaryCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  color 
}) => {
  const isPositive = change >= 0;

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column' 
      }}
    >
      <CardActionArea sx={{ flexGrow: 1 }}>
        <CardContent>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}
          >
            <Box>
              <Typography 
                variant="subtitle2" 
                color="text.secondary"
                gutterBottom
              >
                {title}
              </Typography>
              <Typography 
                variant="h5" 
                component="div" 
                fontWeight="bold"
              >
                {value}
              </Typography>
            </Box>
            
            <Box 
              sx={{ 
                backgroundColor: color, 
                color: 'white', 
                borderRadius: '50%', 
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {icon}
            </Box>
          </Box>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: isPositive ? 'success.main' : 'error.main',
              mt: 1 
            }}
          >
            {isPositive ? '+' : ''}{change}% 
            {isPositive ? ' Increase' : ' Decrease'}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

// Summary Cards Component
const SummaryCards: React.FC = () => {
  return (
    <Grid 
      container 
      spacing={3} 
      sx={{ 
        mt: 2, 
        mb: 4 
      }}
    >
      {summaryCardsData.map((cardData, index) => (
        <Grid 
          item 
          xs={12} 
          sm={6} 
          md={3} 
          key={index}
        >
          <SummaryCard {...cardData} />
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCards;
