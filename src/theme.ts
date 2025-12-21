import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { blue, grey, green } from '@mui/material/colors';

// Extend the default theme to include custom properties
declare module '@mui/material/styles' {
  interface Theme {
    customShadows: {
      card: string;
      navbar: string;
    };
  }
  
  interface ThemeOptions {
    customShadows?: {
      card?: string;
      navbar?: string;
    };
  }
}

// Create a responsive theme with custom configurations
const theme = createTheme({
  palette: {
    primary: {
      main: blue[700],
      light: blue[500],
      dark: blue[900],
    },
    secondary: {
      main: green[600],
      light: green[400],
      dark: green[800],
    },
    background: {
      default: grey[100],
      paper: '#FFFFFF',
    },
    text: {
      primary: grey[900],
      secondary: grey[700],
    },
  },
  typography: {
    fontFamily: [
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
    body2: {
      fontSize: '0.875rem',
      color: grey[600],
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
        },
        containedPrimary: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
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
  customShadows: {
    card: '0 4px 6px rgba(0,0,0,0.1)',
    navbar: '0 2px 4px rgba(0,0,0,0.05)',
  },
});

// Make the theme responsive
const responsiveTheme = responsiveFontSizes(theme);

export default responsiveTheme;
