import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import Dashboard from '../pages/Dashboard';
import theme from '../theme';

// Responsive breakpoint tests
const breakpoints = [
  { name: 'mobile', width: 375 },
  { name: 'tablet', width: 768 },
  { name: 'desktop', width: 1024 },
  { name: 'large desktop', width: 1440 }
];

describe('Dashboard Responsiveness', () => {
  breakpoints.forEach(({ name, width }) => {
    test(`renders correctly on ${name} screen`, () => {
      // Mock window inner width
      window.innerWidth = width;
      window.dispatchEvent(new Event('resize'));

      render(
        <ThemeProvider theme={theme}>
          <Dashboard />
        </ThemeProvider>
      );

      // Basic component presence checks
      expect(screen.getByTestId('top-nav-bar')).toBeInTheDocument();
      expect(screen.getByTestId('hero-panel')).toBeInTheDocument();
      expect(screen.getByTestId('summary-cards')).toBeInTheDocument();
      expect(screen.getByTestId('entries-table')).toBeInTheDocument();
    });
  });
});

// Accessibility tests
describe('Dashboard Accessibility', () => {
  test('has proper aria labels and roles', () => {
    render(
      <ThemeProvider theme={theme}>
        <Dashboard />
      </ThemeProvider>
    );

    // Check for key accessibility attributes
    const navBar = screen.getByTestId('top-nav-bar');
    expect(navBar).toHaveAttribute('role', 'navigation');
    
    const mainContent = screen.getByTestId('dashboard-main');
    expect(mainContent).toHaveAttribute('role', 'main');
  });
});

// Performance monitoring
describe('Dashboard Performance', () => {
  test('renders without significant performance overhead', () => {
    const startTime = performance.now();
    render(
      <ThemeProvider theme={theme}>
        <Dashboard />
      </ThemeProvider>
    );
    const endTime = performance.now();

    // Ensure initial render is under 100ms
    expect(endTime - startTime).toBeLessThan(100);
  });
});
