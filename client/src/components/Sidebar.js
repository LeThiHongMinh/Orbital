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
  Switch,
  Button,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';
import FeedbackIcon from '@mui/icons-material/Feedback';
import GroupIcon from '@mui/icons-material/Group';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PeopleIcon from '@mui/icons-material/People';
import { onLogout, profileCheck, getNotifications } from '../api/auth';
import { unauthenticateUser } from '../redux/slices/authSlice';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '../redux/slices/uiSlice';

const Sidebar = () => {
  const { isAuth } = useSelector((state) => state.auth);
  const isDarkMode = useSelector(state => state.ui.isDarkMode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await profileCheck();
        if (data.user) {
          setFullName(data.user.full_name);
          setAvatar(data.user.avatar || '');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        const notificationsToday = response.data.filter(notification => {
          const today = new Date().toISOString().split('T')[0];
          return new Date(notification.created_at).toISOString().split('T')[0] === today;
        });
        setNotifications(notificationsToday);
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

  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode());
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
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: isDarkMode ? '#333' : '#fff',
          color: isDarkMode ? '#fff' : '#000',
        },
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
          src={avatar || 'https://i.pinimg.com/564x/40/27/ef/4027ef3433c0541374a41c841d9c26eb.jpg'}
          sx={{ width: 100, height: 100, mb: 2 }}
        />
        <Typography variant="h6">{fullName}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => handleNavigation('/profile')}>
            <SettingsIcon sx={{ color: isDarkMode ? '#fff' : '#000' }} />
          </IconButton>
          <IconButton onClick={handleNotificationClick}>
            <Badge badgeContent={notifications.length} color="secondary">
              <NotificationsIcon sx={{ color: isDarkMode ? '#fff' : '#000' }} />
            </Badge>
          </IconButton>
          <Switch checked={isDarkMode} onChange={handleDarkModeToggle} />
        </Box>
      </Box>
      <List>
        <ListItem button onClick={() => handleNavigation('/')}>
          <ListItemIcon>
            <HomeIcon sx={{ color: isDarkMode ? '#fff' : '#000' }} />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/dashboard')}>
          <ListItemIcon>
            <DashboardIcon sx={{ color: isDarkMode ? '#fff' : '#000' }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/library')}>
          <ListItemIcon>
            <LibraryBooksIcon sx={{ color: isDarkMode ? '#fff' : '#000' }} />
          </ListItemIcon>
          <ListItemText primary="Library" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/studyActivities')}>
          <ListItemIcon>
            <SchoolIcon sx={{ color: isDarkMode ? '#fff' : '#000' }} />
          </ListItemIcon>
          <ListItemText primary="Study Activities" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/portals')}>
          <ListItemIcon>
            <GroupIcon sx={{ color: isDarkMode ? '#fff' : '#000' }} />
          </ListItemIcon>
          <ListItemText primary="Portals" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/matchmaking')}>
          <ListItemIcon>
            <PeopleIcon sx={{ color: isDarkMode ? '#fff' : '#000' }} />
          </ListItemIcon>
          <ListItemText primary="Matchmaking" />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon sx={{ color: isDarkMode ? '#fff' : '#000' }} />
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
  <Box sx={{ p: 2, backgroundColor: isDarkMode ? '#444' : '#fff', color: isDarkMode ? '#fff' : '#000' }}>
    <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Today's Notifications</div>
    <List>
      {notifications.length === 0 ? (
        <Box>
          <ListItem>No notifications for today.</ListItem>
          <ListItem>
            <Button
              onClick={() => handleNavigation('/noti')}
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, textAlign: 'center' }}
            >
              See all notifications
            </Button>
          </ListItem>
        </Box>
      ) : (
        <>
          {notifications.map((notification) => (
            <ListItem key={notification.id}>
              <ListItemAvatar>
                <Avatar>
                  <NotificationsIcon sx={{ color: isDarkMode ? '#fff' : '#000' }} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={notification.description}
                secondary={
                  <>
                    <div>{new Date(notification.created_at).toLocaleString()}</div>
                    {notification.course_code && <div>Course: {notification.course_code}</div>}
                  </>
                }
              />
            </ListItem>
          ))}
          <ListItem>
            <Button
              onClick={() => handleNavigation('/noti')}
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, textAlign: 'center' }}
            >
              See all notifications
            </Button>
          </ListItem>
        </>
      )}
    </List>
  </Box>
</Popover>
    </Drawer>
  );
};

export default Sidebar;
