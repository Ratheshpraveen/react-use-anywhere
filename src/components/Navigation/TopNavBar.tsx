import React, { useContext } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Avatar, 
  IconButton, 
  Box,
  TextField,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Brightness4 as DarkModeIcon, 
  Brightness7 as LightModeIcon 
} from '@mui/icons-material';
import { ThemeContext } from '../../theme/ThemeProvider';

interface TopNavBarProps {
  companyName?: string;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({ companyName = 'Dashboard' }) => {
  const { mode, toggleTheme } = useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAvatarClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        {/* Logo and Company Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
            {companyName.charAt(0)}
          </Avatar>
          <Typography variant="h6" component="div">
            {companyName}
          </Typography>
        </Box>

        {/* Search Field */}
        <Box sx={{ flexGrow: 1, mx: 2 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            fullWidth
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
          />
        </Box>

        {/* Theme Toggle */}
        <IconButton onClick={toggleTheme} color="inherit">
          {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>

        {/* New Project Button */}
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mr: 2 }}
        >
          New Project
        </Button>

        {/* User Avatar with Dropdown */}
        <Avatar 
          onClick={handleAvatarClick}
          sx={{ cursor: 'pointer' }}
        >
          JD
        </Avatar>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleAvatarClose}
        >
          <MenuItem onClick={handleAvatarClose}>Profile</MenuItem>
          <MenuItem onClick={handleAvatarClose}>Settings</MenuItem>
          <MenuItem onClick={handleAvatarClose}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
