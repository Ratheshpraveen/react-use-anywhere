import React from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  useTheme,
  useMediaQuery 
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

// TypeScript interfaces for stats and chart data
interface AchievementStat {
  label: string;
  value: number;
  icon: React.ReactNode;
}

interface ChartData {
  name: string;
  value: number;
}

interface HeroPanelProps {
  achievementStats: AchievementStat[];
  chartData: ChartData[];
}

const HeroPanel: React.FC<HeroPanelProps> = ({ 
  achievementStats, 
  chartData 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid container spacing={3}>
      {/* Achievement Stats */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          {achievementStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  alignItems: 'center',
                  height: '100%'
                }}
              >
                <Box mr={2} color={theme.palette.primary.main}>
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="h6">{stat.value}</Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* Data Visualization */}
      <Grid item xs={12}>
        <Paper 
          elevation={2} 
          sx={{ 
            p: 2, 
            height: 300,
            width: '100%' 
          }}
        >
          <Typography variant="h6" gutterBottom>
            Performance Overview
          </Typography>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={theme.palette.primary.main} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default HeroPanel;
