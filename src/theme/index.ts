import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Define a custom color palette
const primaryColor = {
  main: '#1976d2',      // A professional blue
  light: '#4791db',
  dark: '#115293',
  contrastText: '#ffffff'
};

const secondaryColor = {
  main: '#dc004e',      // A vibrant accent color
  light: '#ff4081',
  dark: '#9a0036',
  contrastText: '#ffffff'
};

// Create a responsive theme
const theme = responsiveFontSizes(createTheme({
  palette: {
    primary: primaryColor,
    secondary: secondaryColor,
    background: {
      default: '#f4f4f4',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
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
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Prevents uppercase transformation
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
  },
}));

export default theme;
