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
  Tooltip
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group'; // Import the Matchmaking icon
import NotificationsIcon from '@mui/icons-material/Notifications'; // Notification icon

import { onLogout } from '../api/auth';
import { unauthenticateUser } from '../redux/slices/authSlice';
import { useDispatch } from 'react-redux';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

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

  useEffect(() => {
    fetchNotifications(); // Fetch notifications on component mount
  }, []);

  const fetchNotifications = async () => {
    try {
      const upcomingActivities = await getNotifications();
      setNotifications(upcomingActivities);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const NotificationIcon = ({ count }) => {
    return (
      <IconButton color="inherit">
        <Badge badgeContent={count} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
    );
  };

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
          src="/path/to/profile/image.jpg" // replace with the path to your profile image
          sx={{ width: 100, height: 100, mb: 2 }}
        />
        <Typography variant="h6">Your Name</Typography>
        <IconButton onClick={() => handleNavigation('/profile')}>
          <SettingsIcon />
        </IconButton>
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
      <Box sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)' }}>
        <Tooltip title="Notifications">
          <NotificationIcon count={notifications.length} />
        </Tooltip>
      </Box>
    </Drawer>
  );
};

// Function to get upcoming study activities as notifications
const getNotifications = async () => {
  try {
    // Mock data or replace with your actual API call
    const activities = [
      { id: 1, title: 'Upcoming Study Activity 1', date: '2024-07-05' },
      { id: 2, title: 'Upcoming Study Activity 2', date: '2024-07-08' },
      { id: 3, title: 'Upcoming Study Activity 3', date: '2024-07-10' },
    ];

    // Filter activities based on upcoming conditions (e.g., within next 7 days)
    const upcomingActivities = activities.filter(activity => {
      const activityDate = new Date(activity.date); // Assuming activity date field is 'date'
      const today = new Date();
      const nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);

      return activityDate >= today && activityDate <= nextWeek;
    });

    return upcomingActivities;
  } catch (error) {
    console.error('Failed to fetch study activities:', error);
    throw new Error('Failed to fetch study activities');
  }
};

export default Sidebar;
