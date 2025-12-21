import React from 'react';
import { AppBar, Toolbar, Typography, InputBase, Button, Avatar, Menu, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface TopNavBarProps {
  // Add any necessary props
}

const TopNavBar: React.FC<TopNavBarProps> = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        {/* Logo */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 0.1 }}>
          Dashboard
        </Typography>

        {/* Navigation Links */}
        <Typography sx={{ flexGrow: 0.4 }}>
          {/* Add navigation links */}
        </Typography>

        {/* Search Field */}
        <div style={{ position: 'relative', marginRight: 16 }}>
          <SearchIcon style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 8 }} />
          <InputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            sx={{
              color: 'inherit',
              '& .MuiInputBase-input': {
                paddingLeft: `calc(1em + 32px)`,
                width: '100%',
              },
            }}
          />
        </div>

        {/* New Project Button */}
        <Button variant="contained" color="secondary" sx={{ marginRight: 2 }}>
          New Project
        </Button>

        {/* User Avatar */}
        <Avatar 
          onClick={handleMenuOpen}
          sx={{ cursor: 'pointer' }}
        >
          U
        </Avatar>

        {/* User Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavBar;
