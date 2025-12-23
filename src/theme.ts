import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Define primary and secondary colors
const PRIMARY_COLOR = {
  main: '#1976d2',      // Deep blue
  light: '#42a5f5',     // Lighter blue
  dark: '#1565c0',      // Darker blue
  contrastText: '#fff'  // White text on primary color
};

const SECONDARY_COLOR = {
  main: '#9c27b0',      // Purple
  light: '#ba68c8',     // Light purple
  dark: '#7b1fa2',      // Dark purple
  contrastText: '#fff'  // White text on secondary color
};

// Create a responsive theme with custom configurations
const theme = createTheme({
  palette: {
    primary: PRIMARY_COLOR,
    secondary: SECONDARY_COLOR,
    mode: 'light', // Default to light mode
    background: {
      default: '#f4f6f8', // Light grey background
      paper: '#ffffff'    // White paper background
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
      fontWeight: 600
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500
    },
    body1: {
      fontSize: '1rem'
    }
  },
  components: {
    // Customize Material-UI components
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)' // Subtle shadow for app bar
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)' // Soft shadow for cards
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Prevent uppercase transformation
          borderRadius: 8
        }
      }
    }
  },
  // Make typography responsive
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920
    }
  }
});

// Make the theme responsive
const responsiveTheme = responsiveFontSizes(theme);

export default responsiveTheme;

// Optional: Dark mode theme
export const darkTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e'
    }
  }
});
