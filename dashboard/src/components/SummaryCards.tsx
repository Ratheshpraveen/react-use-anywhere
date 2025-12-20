import React from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box 
} from '@mui/material';
import { 
  AssignmentTurnedIn as CompletedIcon,
  PendingActions as PendingIcon,
  Error as IssuesIcon 
} from '@mui/icons-material';

const SummaryCards: React.FC = () => {
  const summaryData = [
    {
      title: 'Completed Projects',
      value: 32,
      icon: <CompletedIcon color="success" />,
    },
    {
      title: 'Pending Projects',
      value: 10,
      icon: <PendingIcon color="warning" />,
    },
    {
      title: 'Open Issues',
      value: 5,
      icon: <IssuesIcon color="error" />,
    },
  ];

  return (
    <Grid container spacing={3}>
      {summaryData.map((item, index) => (
        <Grid item xs={12} md={4} key={index}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography variant="h4" color="primary">
                    {item.value}
                  </Typography>
                </Box>
                {item.icon}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCards;
