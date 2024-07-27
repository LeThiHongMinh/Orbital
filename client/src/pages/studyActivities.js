import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../components/layout';
import {
  createStudyActivity,
  getStudyActivities,
  updateStudyActivity,
  deleteStudyActivity,
  toggleStudyActivityStatus,
} from '../api/auth';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Modal,
  TextField,
  Button,
  Container,
  Typography,
  Box,
} from '@mui/material';

const localizer = momentLocalizer(moment);

const StudyActivities = () => {
  const isDarkMode = useSelector((state) => state.ui.isDarkMode); // Access dark mode state from Redux
  const { isAuth } = useSelector((state) => state.auth);

  console.log('Current isAuth state:', isAuth);

  const [activities, setActivities] = useState([]);
  const [formValues, setFormValues] = useState({
    course_code: '',
    activity_type: '',
    activity_description: '',
    start_time: new Date(),
    end_time: new Date(),
  });
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isAuth) {
      fetchActivities();
    }
  }, [isAuth]);

  const fetchActivities = async () => {
    try {
      const { data } = await getStudyActivities();
      console.log('Fetched activities:', data.activities);  // Debugging fetched data
      const formattedActivities = data.activities.map((activity) => ({
        ...activity,
        start: new Date(activity.start_time),
        end: new Date(activity.end_time),
        title: activity.activity_type,
        status: activity.status,
        style: {
          backgroundColor: activity.status ? '#4caf50' : '#e91e63',
          color: 'white',
        },
      }));
      console.log('Formatted activities:', formattedActivities);  // Debugging formatted activities
      setActivities(formattedActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const onDateChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedActivity) {
        await updateStudyActivity(selectedActivity.id, formValues);
      } else {
        await createStudyActivity(formValues);
      }
      setFormValues({
        course_code: '',
        activity_type: '',
        activity_description: '',
        start_time: new Date(),
        end_time: new Date(),
      });
      setSelectedActivity(null);
      fetchActivities();
      handleClose();
    } catch (error) {
      console.error('Error creating/updating activity:', error);
    }
  };

  const handleOpen = (activity = null) => {
    if (activity) {
      setSelectedActivity(activity);
      setFormValues({
        course_code: activity.course_code,
        activity_type: activity.activity_type,
        activity_description: activity.activity_description,
        start_time: new Date(activity.start_time),
        end_time: new Date(activity.end_time),
      });
    } else {
      setFormValues({
        course_code: '',
        activity_type: '',
        activity_description: '',
        start_time: new Date(),
        end_time: new Date(),
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedActivity(null);
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudyActivity(id);
      fetchActivities();  // Refresh activities list
      handleClose();
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleStudyActivityStatus(id);
      fetchActivities();  // Refresh activities list
      handleClose();
    } catch (error) {
      console.error('Error toggling activity status:', error);
    }
  };

  return (
    <Layout>
      <Container>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          className={isDarkMode ? 'text-white' : 'text-black'}
        >
          Study Activities
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpen()}
          className={`mb-5 ${isDarkMode ? 'bg-purple-600' : 'bg-blue-600'}`}
        >
          Create Activity
        </Button>

        <Calendar
          localizer={localizer}
          events={activities}
          startAccessor="start"
          endAccessor="end"
          style={{
            height: 500,
            margin: '50px 0',
            backgroundColor: isDarkMode ? '#1a202c' : 'white',
            color: isDarkMode ? 'white' : 'black',
          }}
          onSelectEvent={(event) => handleOpen(event)}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.status ? 'grey' : '#e91e63',
              color: 'white',
            },
          })}
        />

        <Modal open={open} onClose={handleClose}>
          <Box
            component="form"
            onSubmit={onSubmit}
            className={`modal-content ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} 
                        p-6 rounded-lg mx-auto my-10 max-w-md`}
            sx={{ maxHeight: '80vh', overflowY: 'auto' }}
          >
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              className={isDarkMode ? 'text-white' : 'text-black'}
            >
              {selectedActivity ? 'Edit Activity' : 'Create Activity'}
            </Typography>

            <TextField
              label="Course Code"
              name="course_code"
              value={formValues.course_code}
              onChange={onChange}
              fullWidth
              required
              margin="normal"
              InputProps={{
                style: { color: isDarkMode ? 'white' : 'black' },
              }}
              InputLabelProps={{
                style: { color: isDarkMode ? 'white' : 'black' },
              }}
              className={isDarkMode ? 'bg-gray-700' : 'bg-white'}
            />
            <TextField
              label="Activity Type"
              name="activity_type"
              value={formValues.activity_type}
              onChange={onChange}
              fullWidth
              required
              margin="normal"
              InputProps={{
                style: { color: isDarkMode ? 'white' : 'black' },
              }}
              InputLabelProps={{
                style: { color: isDarkMode ? 'white' : 'black' },
              }}
              className={isDarkMode ? 'bg-gray-700' : 'bg-white'}
            />
            <TextField
              label="Activity Description"
              name="activity_description"
              value={formValues.activity_description}
              onChange={onChange}
              fullWidth
              required
              margin="normal"
              InputProps={{
                style: { color: isDarkMode ? 'white' : 'black' },
              }}
              InputLabelProps={{
                style: { color: isDarkMode ? 'white' : 'black' },
              }}
              className={isDarkMode ? 'bg-gray-700' : 'bg-white'}
            />
            <TextField
              type="datetime-local"
              label="Start Time"
              name="start_time"
              value={moment(formValues.start_time).format('YYYY-MM-DDTHH:mm')}
              onChange={(e) => onDateChange('start_time', new Date(e.target.value))}
              fullWidth
              required
              margin="normal"
              InputLabelProps={{
                shrink: true,
                style: { color: isDarkMode ? 'white' : 'black' },
              }}
              InputProps={{
                style: { color: isDarkMode ? 'white' : 'black' },
              }}
              className={isDarkMode ? 'bg-gray-700' : 'bg-white'}
            />
            <TextField
              type="datetime-local"
              label="End Time"
              name="end_time"
              value={moment(formValues.end_time).format('YYYY-MM-DDTHH:mm')}
              onChange={(e) => onDateChange('end_time', new Date(e.target.value))}
              fullWidth
              required
              margin="normal"
              InputLabelProps={{
                shrink: true,
                style: { color: isDarkMode ? 'white' : 'black' },
              }}
              InputProps={{
                style: { color: isDarkMode ? 'white' : 'black' },
              }}
              className={isDarkMode ? 'bg-gray-700' : 'bg-white'}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={`mt-5 ${isDarkMode ? 'bg-purple-600' : 'bg-blue-600'}`}
            >
              {selectedActivity ? 'Update Activity' : 'Create Activity'}
              </Button>
              {selectedActivity && (
                <Button
                  type="button"
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(selectedActivity.id)}
                  className="mt-3"
                >
                  Delete
                </Button>
              )}
              {selectedActivity && (
                <Button
                  type="button"
                  variant="outlined"
                  color="success"
                  onClick={() => handleToggleStatus(selectedActivity.id)}
                  className="mt-3"
                >
                  Toggle Status
                </Button>
              )}
            </Box>
          </Modal>
        </Container>
      </Layout>
    );
  };
  
  export default StudyActivities;
  