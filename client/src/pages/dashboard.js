import React, { useState, useEffect } from 'react';
import { LinearProgress, Typography, Grid, Paper } from '@mui/material';
import Layout from '../components/Layout'; // Assuming Layout component structure
import CalendarComponent from '../components/Calendar'; // Custom Calendar component
import CourseListSearch from '../components/CourseListSearch'; // Custom Course List search component
// Replace with mock data or define a placeholder function for getStudyActivities
import { getStudyActivities } from '../api/auth'; // Import getStudyActivities function
import './Dashboard.css'; // Custom CSS for styling

const Dashboard = () => {
  const [completedCount, setCompletedCount] = useState(0);
  const [incompleteCount, setIncompleteCount] = useState(0);
  const [totalHoursStudied, setTotalHoursStudied] = useState(0);
  const [progress, setProgress] = useState(0);
  const [studyActivities, setStudyActivities] = useState([]);

  useEffect(() => {
    const fetchStudyActivitiesData = async () => {
      try {
        // Simulating fetch with mock data or placeholder function
        const activities = await getStudyActivities();

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

  // Function to calculate completed and incomplete task counts
  const calculateTaskStats = (tasks) => {
    let completed = 0;
    let incomplete = 0;

    tasks.forEach((task) => {
      if (task.status === 'completed') {
        completed++;
      } else if (task.status === 'incomplete') {
        incomplete++;
      }
    });

    return { completedCount: completed, incompleteCount: incomplete };
  };

  // Function to calculate total hours studied
  const calculateTotalHoursStudied = (tasks) => {
    let totalHours = 0;

    tasks.forEach((task) => {
      totalHours += task.hoursStudied || 0; // Ensure hoursStudied is numeric
    });

    return totalHours;
  };

  return (
    <Layout>
      <div className="dashboard-container bg-red-100">
        <Grid container spacing={3}>
          {/* Top Section */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <Paper className="dashboard-card">
                  <Typography variant="h6" gutterBottom>
                    Completed Tasks
                  </Typography>
                  <Typography variant="h4">{completedCount}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper className="dashboard-card">
                  <Typography variant="h6" gutterBottom>
                    Incomplete Tasks
                  </Typography>
                  <Typography variant="h4">{incompleteCount}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper className="dashboard-card">
                  <Typography variant="h6" gutterBottom>
                    Total Hours Studied
                  </Typography>
                  <Typography variant="h4">{totalHoursStudied} hours</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          {/* Progress Section */}
          <Grid item xs={12}>
            <Paper className="dashboard-card">
              <Typography variant="h6" gutterBottom>
                Progress
              </Typography>
              <LinearProgress variant="determinate" value={progress} />
              <Typography variant="body2" color="textSecondary">
                {Math.round(progress)}% Complete
              </Typography>
            </Paper>
          </Grid>
          {/* Bottom Left Section */}
          <Grid item xs={12} sm={6}>
            <Paper className="dashboard-card">
              <Typography variant="h6" gutterBottom>
                Calendar
              </Typography>
              <CalendarComponent />
            </Paper>
          </Grid>
          {/* Bottom Right Section */}
          <Grid item xs={12} sm={6}>
            <Paper className="dashboard-card">
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
