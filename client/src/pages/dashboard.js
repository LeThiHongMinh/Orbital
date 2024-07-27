import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LinearProgress, Typography, Grid, Paper, Button } from '@mui/material';
import Layout from '../components/layout'; // Assuming Layout component structure
import CalendarComponent from '../components/Calendar'; // Custom Calendar component
import CourseListSearch from '../components/Courselist'; // Custom Course List search component
import { getStudyActivities } from '../api/auth'; // Import getStudyActivities function
import './Dashboard.css'; // Custom CSS for styling
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const [progress, setProgress] = useState(0);
  const [studyActivities, setStudyActivities] = useState([]);
  const isDarkMode = useSelector((state) => state.ui.isDarkMode); // Access dark mode state from Redux store
  const navigate = useNavigate();
  const [tasksDueToday, setTasksDueToday] = useState(0);
  const [totalCompletedTasks, setTotalCompletedTasks] = useState(0);
  const [totalIncompleteTasks, setTotalIncompleteTasks] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [incompleteCount, setIncompleteCount] = useState(0);
  const [totalHoursStudied, setTotalHoursStudied] = useState(0);

  useEffect(() => {
    const fetchStudyActivitiesData = async () => {
      try {
        const response = await getStudyActivities();
        console.log('Fetched activities:', response.data);

        const activities = response.data.activities || [];
        setStudyActivities(activities);

        // Calculate task stats
        const { completedCount, incompleteCount } = calculateTaskStats(activities);
        const totalHours = calculateTotalHoursStudied(activities);

        // Calculate tasks due today
        const dueTodayCount = calculateTasksDueToday(activities);

        // Set state for completed, incomplete tasks, and total hours studied
        setCompletedCount(completedCount);
        setIncompleteCount(incompleteCount);
        setTotalHoursStudied(totalHours);
        setTotalCompletedTasks(completedCount);
        setTotalIncompleteTasks(incompleteCount);
        setTasksDueToday(dueTodayCount);

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

  const processChartData = (interval) => {
    const groupedData = {};

    studyActivities.forEach((activity) => {
      const date = new Date(activity.created_at);
      let key;

      switch (interval) {
        case 'day':
          key = date.toLocaleDateString();
          break;
        case 'week':
          key = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
          break;
        case 'month':
          key = `${date.getFullYear()}-${date.getMonth() + 1}`;
          break;
        default:
          key = date.toLocaleDateString();
      }

      if (!groupedData[key]) {
        groupedData[key] = { name: key, completed: 0, incomplete: 0 };
      }

      if (activity.status === true) {
        groupedData[key].completed++;
      } else {
        groupedData[key].incomplete++;
      }
    });

    return Object.values(groupedData);
  };

  const dailyData = processChartData('day');
  const weeklyData = processChartData('week');
  const monthlyData = processChartData('month');
  const calculateTasksDueToday = (tasks) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    return tasks.filter(task => {
      const deadline = new Date(task.deadline); // Adjust this if the deadline field has a different name
      return deadline.toISOString().split('T')[0] === today;
    }).length;
  };

  return (
    <Layout>
      <div className={`dashboard-container ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-red-100 text-black'}`}>
        <Grid container spacing={3} >
          {/* Top Section */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Paper className={`dashboard-card ${isDarkMode ? 'bg-gray-800 text-black' : 'bg-white text-black'}`}>
                  <Typography variant="h6" gutterBottom>
                    Task Status (Daily)
                  </Typography>
                  <div className="chart-container">
                    <BarChart width={350} height={250} data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="completed" fill={isDarkMode ? '#bb86fc' : 'red'} />
                      <Bar dataKey="incomplete" fill={isDarkMode ? '#ff5722' : '#FFC107'} />
                    </BarChart>
                  </div>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper className={`dashboard-card ${isDarkMode ? 'bg-gray-800 text-black' : 'bg-white text-black'}`}>
                  <Typography variant="h6" gutterBottom>
                    Task Status (Weekly)
                  </Typography>
                  <div className="chart-container">
                    <BarChart width={350} height={250} data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="completed" fill={isDarkMode ? '#bb86fc' : 'red'} />
                      <Bar dataKey="incomplete" fill={isDarkMode ? '#ff5722' : '#FFC107'} />
                    </BarChart>
                  </div>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper className={`dashboard-card ${isDarkMode ? 'bg-gray-800 text-black' : 'bg-white text-black'}`}>
                  <Typography variant="h6" gutterBottom>
                    Task Status (Monthly)
                  </Typography>
                  <div className="chart-container">
                    <BarChart width={350} height={250} data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="completed" fill={isDarkMode ? '#bb86fc' : 'red'} />
                      <Bar dataKey="incomplete" fill={isDarkMode ? '#ff5722' : '#FFC107'} />
                    </BarChart>
                  </div>
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
              <Typography variant="body1">
                {progress.toFixed(2)}% completed
              </Typography>
              <Button variant="contained" color="primary" onClick={handleNavigateToStudyActivities}>
                View Study Activities
              </Button>
            </Paper>
          </Grid>
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
