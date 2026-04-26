import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, Typography, IconButton,
  List, ListItem, ListItemIcon, ListItemText, Avatar,
  Menu, MenuItem, Divider, useMediaQuery, useTheme, Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as LeadsIcon,
  Business as CompaniesIcon,
  Assignment as TasksIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  AccountCircle,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { label: 'Leads', icon: <LeadsIcon />, path: '/leads' },
  { label: 'Companies', icon: <CompaniesIcon />, path: '/companies' },
  { label: 'Tasks', icon: <TasksIcon />, path: '/tasks' },
];

const Sidebar = ({ open, onClose, variant }) => {
  const location = useLocation();

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
          color: '#fff',
          borderRight: 'none',
          boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
        },
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #e94560, #c73652)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 18,
            color: '#fff',
            flexShrink: 0,
          }}
        >
          M
        </Box>
        <Typography variant="h6" fontWeight={700} color="#fff" letterSpacing={0.5}>
          Mini CRM
        </Typography>
      </Box>

      {/* Nav Items */}
      <List sx={{ p: 2, flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = location.pathname.startsWith(item.path);
          return (
            <ListItem
              key={item.path}
              component={Link}
              to={item.path}
              onClick={onClose}
              sx={{
                borderRadius: '10px',
                mb: 0.5,
                px: 2,
                py: 1.2,
                color: active ? '#fff' : 'rgba(255,255,255,0.6)',
                background: active
                  ? 'linear-gradient(135deg, #e94560 0%, #c73652 100%)'
                  : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: active
                    ? 'linear-gradient(135deg, #e94560 0%, #c73652 100%)'
                    : 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: 'inherit',
                  minWidth: 38,
                  '& svg': { fontSize: 20 },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: active ? 600 : 500, fontSize: 14 }}
              />
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Typography variant="caption" color="rgba(255,255,255,0.3)" sx={{ px: 1 }}>
          v1.0.0
        </Typography>
      </Box>
    </Drawer>
  );
};

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      {isMobile ? (
        <Sidebar
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          variant="temporary"
        />
      ) : (
        <Sidebar open onClose={() => {}} variant="permanent" />
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          ml: isMobile ? 0 : 0,
        }}
      >
        {/* Top Bar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: '#fff',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            color: '#1a1a2e',
          }}
        >
          <Toolbar sx={{ gap: 2 }}>
            {isMobile && (
              <IconButton edge="start" onClick={() => setMobileOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}
            <Box sx={{ flexGrow: 1 }} />
            {/* User Menu */}
            <Tooltip title="Account">
              <Box
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'pointer',
                  borderRadius: '10px',
                  px: 1.5,
                  py: 0.8,
                  '&:hover': { background: '#f5f6fa' },
                  transition: 'background 0.2s',
                }}
              >
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    background: 'linear-gradient(135deg, #e94560, #c73652)',
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Typography variant="body2" fontWeight={600} lineHeight={1.2}>
                    {user?.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" textTransform="capitalize">
                    {user?.role}
                  </Typography>
                </Box>
                <KeyboardArrowDown sx={{ fontSize: 18, color: 'text.secondary' }} />
              </Box>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: { borderRadius: 2, minWidth: 180, mt: 1, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' },
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="body2" fontWeight={600}>{user?.name}</Typography>
                <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ gap: 1.5, color: 'error.main', py: 1.2 }}>
                <LogoutIcon fontSize="small" />
                <Typography variant="body2" fontWeight={500}>Logout</Typography>
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, background: '#f5f6fa' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
