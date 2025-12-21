import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  InputBase,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Search as SearchIcon, 
  Add as AddIcon 
} from '@mui/icons-material';

const TopNavBar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        {isMobile && (
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
        )}
        
        {/* Logo */}
        <Typography variant="h6" sx={{ flexGrow: 0, marginRight: 2 }}>
          Dashboard
        </Typography>
        
        {/* Search Field */}
        <Box 
          sx={{ 
            position: 'relative', 
            borderRadius: 1, 
            backgroundColor: 'rgba(255,255,255,0.15)',
            marginLeft: 2,
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box sx={{ padding: 1, height: '100%', display: 'flex', alignItems: 'center' }}>
            <SearchIcon />
          </Box>
          <InputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            sx={{ 
              color: 'inherit', 
              width: '100%',
              '& .MuiInputBase-input': {
                padding: 1,
              }
            }}
          />
        </Box>
        
        {/* Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit" aria-label="new project">
            <AddIcon />
          </IconButton>
          
          <IconButton 
            color="inherit" 
            onClick={handleAvatarClick}
          >
            <Avatar 
              alt="User Avatar" 
              src="/path/to/avatar.jpg" 
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>
        </Box>
        
        {/* Avatar Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>Settings</MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavBar;
