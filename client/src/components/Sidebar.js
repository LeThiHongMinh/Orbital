import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Box,
  Typography,
  Badge,
  Popover,
  ListItemAvatar,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import NotificationsIcon from '@mui/icons-material/Notifications';

import { onLogout, profileCheck, getStudyActivities } from '../api/auth'; // Import getStudyActivities
import { unauthenticateUser } from '../redux/slices/authSlice';
import { useSelector, useDispatch } from 'react-redux';

const Sidebar = () => {
  const { isAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await profileCheck();
        if (data.user) {
          setFullName(data.user.full_name);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    const fetchNotifications = async () => {
      try {
        const { data } = await getStudyActivities();
        const activities = Array.isArray(data.activities) ? data.activities : [];

        const today = new Date().toISOString().split('T')[0];
        const todayNotifications = activities.filter(activity => {
          if (activity.endTime) {
            const activityEndTime = new Date(activity.endTime).toISOString().split('T')[0];
            return activityEndTime === today;
          }
          return false;
        });
        setNotifications(todayNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchProfile();
    fetchNotifications();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await onLogout();
      dispatch(unauthenticateUser());
      localStorage.removeItem('isAuth');
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 2,
        }}
      >
        <Avatar
          alt="Profile Image"
          src="https://i.pinimg.com/564x/40/27/ef/4027ef3433c0541374a41c841d9c26eb.jpg" // replace with the path to your profile image
          sx={{ width: 100, height: 100, mb: 2 }}
        />
        <Typography variant="h6">{fullName}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => handleNavigation('/profile')}>
            <SettingsIcon />
          </IconButton>
          <IconButton onClick={handleNotificationClick}>
            <Badge badgeContent={notifications.length} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Box>
      </Box>
      <List>
        <ListItem button onClick={() => handleNavigation('/')}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/dashboard')}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/library')}>
          <ListItemIcon>
            <LibraryBooksIcon />
          </ListItemIcon>
          <ListItemText primary="Library" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/studyActivities')}>
          <ListItemIcon>
            <SchoolIcon />
          </ListItemIcon>
          <ListItemText primary="Study Activities" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/matchmaking')}>
          <ListItemIcon>
            <GroupIcon /> {/* Matchmaking Icon */}
          </ListItemIcon>
          <ListItemText primary="Matchmaking" />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Notifications</Typography>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <ListItem key={notification.id}>
                <ListItemAvatar>
                  <Avatar>
                    <SchoolIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={notification.activity_type}
                  secondary={`Due: ${new Date(notification.endTime).toLocaleString()}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2">No notifications</Typography>
          )}
        </Box>
      </Popover>
    </Drawer>
  );
};

export default Sidebar;
