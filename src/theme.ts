import { createTheme, PaletteMode } from '@mui/material';
import { useState, useMemo } from 'react';

// Define color tokens
const tokens = {
  primary: {
    100: '#d0d1e6',
    200: '#a1a3cd',
    300: '#7176b3',
    400: '#42489a',
    500: '#131a81',
    600: '#0f1466',
    700: '#0b0f4c',
    800: '#080a33',
    900: '#040519'
  },
  grey: {
    100: '#f8f8f8',
    200: '#f1f1f1',
    300: '#e9e9e9',
    400: '#e0e0e0',
    500: '#d8d8d8',
    600: '#adadad',
    700: '#828282',
    800: '#565656',
    900: '#2b2b2b'
  },
  background: {
    light: '#f6f6f6',
    dark: '#121212'
  }
};

// Create theme based on mode
export const createCustomTheme = (mode: PaletteMode) => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? tokens.primary[300] : tokens.primary[500],
        light: tokens.primary[100],
        dark: tokens.primary[700]
      },
      background: {
        default: mode === 'dark' ? tokens.background.dark : tokens.background.light,
        paper: mode === 'dark' ? tokens.grey[900] : tokens.grey[100]
      },
      text: {
        primary: mode === 'dark' ? tokens.grey[100] : tokens.grey[900]
      }
    },
    typography: {
      fontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
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
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: mode === 'dark' 
              ? '0 4px 6px rgba(0,0,0,0.3)' 
              : '0 4px 6px rgba(0,0,0,0.1)'
          }
        }
      }
    }
  });
};

// Custom hook for theme management
export const useCustomTheme = () => {
  const [mode, setMode] = useState<PaletteMode>('light');

  const theme = useMemo(() => createCustomTheme(mode), [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return { theme, mode, toggleColorMode };
};
