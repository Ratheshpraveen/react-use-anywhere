import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { blue, grey } from '@mui/material/colors';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: blue[500],
      light: blue[300],
      dark: blue[700],
    },
    secondary: {
      main: grey[700],
      light: grey[500],
      dark: grey[900],
    },
    mode: 'light', // Default to light mode
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.02)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
  },
});

// Make the theme responsive
const responsiveTheme = responsiveFontSizes(theme);

export default responsiveTheme;

// Theme mode toggle utility
export const toggleThemeMode = (currentMode: 'light' | 'dark') => 
  createTheme({
    ...theme,
    palette: {
      ...theme.palette,
      mode: currentMode === 'light' ? 'dark' : 'light',
    },
  });
