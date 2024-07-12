import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../components/layout';
import { createStudyActivity, getStudyActivities, updateStudyActivity, deleteStudyActivity, toggleStudyActivityStatus } from '../api/auth';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, TextField, Button, Container, Typography, Box } from '@mui/material';

const localizer = momentLocalizer(moment);

const StudyActivities = () => {
  const { isAuth } = useSelector((state) => state.auth);

  console.log('Current isAuth state:', isAuth);

  const [activities, setActivities] = useState([]);
  const [formValues, setFormValues] = useState({
    activity_type: '',
    activity_description: '',
    start_time: new Date(),
    end_time: new Date()
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
      const formattedActivities = data.activities.map(activity => ({
        ...activity,
        start: new Date(activity.start_time),
        end: new Date(activity.end_time),
        title: activity.activity_type,
        status: activity.status,
        style: {
          backgroundColor: activity.status ? '#4caf50' : '#e91e63',
          color: 'white'
        }
      }));
      setActivities(formattedActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const onChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
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
        activity_type: '',
        activity_description: '',
        start_time: new Date(),
        end_time: new Date()
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
        activity_type: activity.activity_type,
        activity_description: activity.activity_description,
        start_time: new Date(activity.start_time),
        end_time: new Date(activity.end_time),
      });
    } else {
      setFormValues({
        activity_type: '',
        activity_description: '',
        start_time: new Date(),
        end_time: new Date()
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
      fetchActivities();
      handleClose();
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleStudyActivityStatus(id);
      fetchActivities();
      handleClose(); // Close the modal after toggling status
    } catch (error) {
      console.error('Error toggling activity status:', error);
    }
  };

  return (
    <Layout>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Study Activities
        </Typography>

        <Button variant="contained" color="primary" onClick={() => handleOpen()} style={{ marginBottom: '20px' }}>
          Create Activity
        </Button>

        <Calendar
          localizer={localizer}
          events={activities}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, margin: '50px 0', backgroundColor: 'white' }}
          onSelectEvent={(event) => handleOpen(event)}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.status ? '#4caf50' : '#e91e63',
              color: 'white',
            },
          })}
        />

        <Modal open={open} onClose={handleClose}>
          <Box component="form" onSubmit={onSubmit} style={{ padding: '20px', background: 'white', margin: 'auto', marginTop: '10%', borderRadius: '8px', maxWidth: '400px' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              {selectedActivity ? 'Edit Activity' : 'Create Activity'}
            </Typography>

            <TextField
              label="Activity Type"
              name="activity_type"
              value={formValues.activity_type}
              onChange={onChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Activity Description"
              name="activity_description"
              value={formValues.activity_description}
              onChange={onChange}
              fullWidth
              required
              margin="normal"
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
              }}
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
              }}
            />
            <Button type="submit" variant="contained" color="primary" style={{ marginRight: '10px' }}>
              {selectedActivity ? 'Update Activity' : 'Create Activity'}
            </Button>
            {selectedActivity && (
              <>
                <Button variant="contained" color="secondary" onClick={() => handleDelete(selectedActivity.id)}>
                  Delete Activity
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleToggleStatus(selectedActivity.id)}
                  style={{
                    marginLeft: '10px',
                    backgroundColor: selectedActivity.status ? '#4caf50' : '#e91e63',
                    color: 'white',
                  }}
                >
                  {selectedActivity.status ? 'Unmark as Complete' : 'Mark as Complete'}
                </Button>
              </>
            )}
          </Box>
        </Modal>
      </Container>
    </Layout>
  );
};

export default StudyActivities;
