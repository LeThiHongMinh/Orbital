import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LinearProgress, Typography, Grid, Paper, Button } from '@mui/material';
import Layout from '../components/layout'; // Assuming Layout component structure
import CalendarComponent from '../components/Calendar'; // Custom Calendar component
import CourseListSearch from '../components/Courselist'; // Custom Course List search component
import { getStudyActivities } from '../api/auth'; // Import getStudyActivities function
import './Dashboard.css'; // Custom CSS for styling

const Dashboard = () => {
  const [completedCount, setCompletedCount] = useState(0);
  const [incompleteCount, setIncompleteCount] = useState(0);
  const [totalHoursStudied, setTotalHoursStudied] = useState(0);
  const [progress, setProgress] = useState(0);
  const [studyActivities, setStudyActivities] = useState([]);

  const isDarkMode = useSelector((state) => state.ui.isDarkMode); // Access dark mode state from Redux store
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchStudyActivitiesData = async () => {
      try {
        const response = await getStudyActivities();
        console.log('Fetched activities:', response.data); // Debugging log

        const activities = response.data.activities || [];
        
        // Update state with fetched activities
        setStudyActivities(activities);

        // Calculate task stats and total hours studied
        const { completedCount, incompleteCount } = calculateTaskStats(activities);
        const totalHours = calculateTotalHoursStudied(activities);

        // Set state for completed, incomplete tasks, and total hours studied
        setCompletedCount(completedCount);
        setIncompleteCount(incompleteCount);
        setTotalHoursStudied(totalHours);

        // Calculate progress percentage
        const totalTasks = completedCount + incompleteCount;
        if (totalTasks > 0) {
          const progressPercentage = (completedCount / totalTasks) * 100;
          setProgress(progressPercentage);
        }
      } catch (error) {
        console.error('Error fetching study activities:', error);
      }
    };

    fetchStudyActivitiesData();
  }, []);

  const calculateTaskStats = (tasks) => {
    let completed = 0;
    let incomplete = 0;

    if (Array.isArray(tasks)) {
      for (const task of tasks) {
        if (task.status === true) {
          completed++;
        } else if (task.status === false) {
          incomplete++;
        }
      }
    } else {
      console.error('Error: Tasks is not an array:', tasks);
    }

    return { completedCount: completed, incompleteCount: incomplete };
  };

  const calculateTotalHoursStudied = (tasks) => {
    let totalHours = 0;
    if (Array.isArray(tasks)) {
      tasks.forEach((task) => {
        if (task.status === true && task.end_time && task.created_at) { // Only count completed tasks
          const endTime = new Date(task.end_time).getTime();
          const startTime = new Date(task.created_at).getTime();
          const hoursStudied = (endTime - startTime) / (1000 * 60 * 60); // Convert milliseconds to hours
          totalHours += hoursStudied;
        }
      });
    } else {
      console.error('Error: Tasks is not an array:', tasks);
    }
    return totalHours;
  };

  const handleNavigateToStudyActivities = () => {
    // Navigate to Study Activities component
    navigate("/studyActivities");
  };

  return (
    <Layout>
      <div className={`dashboard-container ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-red-100 text-black'}`}>
        <Grid container spacing={3}>
          {/* Top Section */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <Paper className={`dashboard-card ${isDarkMode ? 'bg-gray-800 text-black' : 'bg-white text-black'}`}>
                  <Typography variant="h6" gutterBottom>
                    Completed Tasks
                  </Typography>
                  <Typography variant="h4">{completedCount}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper className={`dashboard-card ${isDarkMode ? 'bg-gray-800 text-black' : 'bg-white text-black'}`}>
                  <Typography variant="h6" gutterBottom>
                    Incomplete Tasks
                  </Typography>
                  <Typography variant="h4">{incompleteCount}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper className={`dashboard-card ${isDarkMode ? 'bg-gray-800 text-black' : 'bg-white text-black'}`}>
                  <Typography variant="h6" gutterBottom>
                    Total Hours Studied
                  </Typography>
                  <Typography variant="h4">{totalHoursStudied.toFixed(2)} hours</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          {/* Progress Section */}
          <Grid item xs={12}>
            <Paper className={`dashboard-card ${isDarkMode ? 'bg-gray-800 text-black' : 'bg-white text-black'}`}>
              <Typography variant="h6" gutterBottom>
                Progress
              </Typography>
              <LinearProgress variant="determinate" value={progress} sx={{ bgcolor: isDarkMode ? 'gray.700' : 'red' }} />
              <Typography variant="body2" color={isDarkMode ? 'textSecondary' : 'textPrimary'}>
                {Math.round(progress)}% Complete
              </Typography>
            </Paper>
          </Grid>
          {/* Bottom Left Section */}
          <Grid item xs={12} sm={6}>
            <Paper className={`dashboard-card ${isDarkMode ? 'bg-gray-800 text-black' : 'bg-white text-black'}`}>
              <Typography variant="h6" gutterBottom>
                Calendar
              </Typography>
             <Button
                variant="contained"
                onClick={handleNavigateToStudyActivities}
                sx={{
                  backgroundColor: isDarkMode ? '#bb86fc' : 'red', // Set button color based on dark mode
                  color: 'white',
                  marginTop: '10px',
                  marginLeft: '2px',
                  display: 'block',
                  '&:hover': {
                    backgroundColor: isDarkMode ? '#ae8bfc' : 'red', // Adjust hover color if needed
                  },
                }}
              >
                Go to Study Activities
              </Button>
            </Paper>
          </Grid>
          {/* Bottom Right Section */}
          <Grid item xs={12} sm={6}>
            <Paper className={`dashboard-card ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
              <Typography variant="h6" gutterBottom>
                Course List
              </Typography>
              <CourseListSearch />
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default Dashboard;
