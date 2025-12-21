import { createTheme, Theme } from '@mui/material/styles';
import { blue, grey, red } from '@mui/material/colors';

// Create a base theme with custom configurations
const createCustomTheme = (mode: 'light' | 'dark'): Theme => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? blue[700] : blue[300],
      },
      secondary: {
        main: mode === 'light' ? grey[700] : grey[300],
      },
      error: {
        main: red[500],
      },
      background: {
        default: mode === 'light' ? '#f4f4f4' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
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
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
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
};

// Create light and dark themes
export const lightTheme = createCustomTheme('light');
export const darkTheme = createCustomTheme('dark');

// Theme context for managing theme state
export interface ThemeContextType {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
}
