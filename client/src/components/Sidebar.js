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
import PeopleIcon from '@mui/icons-material/People'; // Icon for matchmaking

import { onLogout, profileCheck, getStudyActivities } from '../api/auth';
import { unauthenticateUser } from '../redux/slices/authSlice';
import { useSelector, useDispatch } from 'react-redux';

const Sidebar = () => {
  const { isAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [avatar, setAvatar] = useState(''); // State to store avatar Base64 string
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await profileCheck();
        if (data.user) {
          setFullName(data.user.full_name);
          setAvatar(data.user.avatar || ''); // Set avatar Base64 string if available
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
          src={avatar || 'https://i.pinimg.com/564x/40/27/ef/4027ef3433c0541374a41c841d9c26eb.jpg'} // Default or placeholder image if avatar is not available
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
        <ListItem button onClick={() => handleNavigation('/feedback')}>
          <ListItemText primary="Feedback" />
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
        <ListItem button onClick={() => handleNavigation('/portals')}>
          <ListItemIcon>
            <GroupIcon /> {/* Portals Icon */}
          </ListItemIcon>
          <ListItemText primary="Portals" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/matchmaking')}>
          <ListItemIcon>
            <PeopleIcon /> {/* Matchmaking Icon */}
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
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Today's Notifications</Typography>
          <List>
            {notifications.map((notification, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar>
                    <NotificationsIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={notification.title} secondary={notification.description} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Popover>
    </Drawer>
  );
};

export default Sidebar;
