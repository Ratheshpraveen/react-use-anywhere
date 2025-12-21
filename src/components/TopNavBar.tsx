import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  TextField, 
  Box, 
  Avatar, 
  Menu, 
  MenuItem, 
  useMediaQuery, 
  useTheme 
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Add as AddIcon, 
  Menu as MenuIcon 
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const TopNavBar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAvatarClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar>
        {/* Logo */}
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ 
            flexGrow: 0, 
            marginRight: 2, 
            textDecoration: 'none', 
            color: 'inherit' 
          }}
        >
          Dashboard
        </Typography>

        {/* Navigation Links */}
        {!isMobile && (
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
            <Button color="inherit" component={Link} to="/projects">Projects</Button>
            <Button color="inherit" component={Link} to="/analytics">Analytics</Button>
            <Button color="inherit" component={Link} to="/reports">Reports</Button>
          </Box>
        )}

        {/* Search Field */}
        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          maxWidth: 400,
          margin: '0 auto'
        }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            fullWidth
            InputProps={{
              startAdornment: <SearchIcon color="action" />
            }}
            sx={{ 
              backgroundColor: 'background.paper',
              borderRadius: 1
            }}
          />
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* New Project Button */}
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            sx={{ display: { xs: 'none', md: 'flex' } }}
          >
            New Project
          </Button>

          {/* Mobile Menu Toggle */}
          {isMobile && (
            <IconButton color="inherit">
              <MenuIcon />
            </IconButton>
          )}

          {/* Avatar Dropdown */}
          <IconButton onClick={handleAvatarClick}>
            <Avatar 
              alt="User Avatar" 
              src="/path/to/avatar.jpg" 
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleAvatarClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleAvatarClose}>Profile</MenuItem>
            <MenuItem onClick={handleAvatarClose}>Settings</MenuItem>
            <MenuItem onClick={handleAvatarClose}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavBar;
