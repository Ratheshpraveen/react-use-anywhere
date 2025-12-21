import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Define primary and secondary colors
const PRIMARY_COLOR = '#1976d2';  // Material Blue
const SECONDARY_COLOR = '#dc004e';  // Material Pink

// Create theme with custom palette and typography
const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY_COLOR,
    },
    secondary: {
      main: SECONDARY_COLOR,
    },
    mode: 'light', // Default to light mode, can be switched dynamically
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
    // Component overrides for consistent styling
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Disable uppercase transformation
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

// Make typography responsive
const responsiveTheme = responsiveFontSizes(theme);

export default responsiveTheme;
