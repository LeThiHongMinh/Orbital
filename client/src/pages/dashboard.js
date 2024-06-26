import React, { useState, useEffect } from 'react';
import { LinearProgress, Typography, Grid, Paper } from '@mui/material';
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

  useEffect(() => {
    const fetchStudyActivitiesData = async () => {
      try {
        const activities = await getStudyActivities(); // Fetch study activities using the imported function

        setStudyActivities(activities);

        const { completedCount, incompleteCount } = calculateTaskStats(activities);
        const totalHours = calculateTotalHoursStudied(activities);

        setCompletedCount(completedCount);
        setIncompleteCount(incompleteCount);
        setTotalHoursStudied(totalHours);

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

    tasks.forEach((task) => {
      if (task.status === 'completed') {
        completed++;
      } else if (task.status === 'incomplete') {
        incomplete++;
      }
    });

    return { completedCount: completed, incompleteCount: incomplete };
  };

  const calculateTotalHoursStudied = (tasks) => {
    let totalHours = 0;

    tasks.forEach((task) => {
      totalHours += task.hoursStudied || 0; // Ensure hoursStudied is numeric
    });

    return totalHours;
  };

  return (
    <Layout>
      <div className="dashboard-container">
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
