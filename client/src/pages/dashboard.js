import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LinearProgress, Typography, Grid, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Layout from '../components/layout';
import CourseListSearch from '../components/Courselist';
import { getStudyActivities } from '../api/auth';
import './Dashboard.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import CalendarComponent from '../components/Calendar';

const Dashboard = () => {
  const [progress, setProgress] = useState(0);
  const [studyActivities, setStudyActivities] = useState([]);
  const [interval, setInterval] = useState('day');
  const isDarkMode = useSelector((state) => state.ui.isDarkMode);
  const navigate = useNavigate();
  const [tasksDueToday, setTasksDueToday] = useState(0);
  const [totalCompletedTasks, setTotalCompletedTasks] = useState(0);
  const [totalIncompleteTasks, setTotalIncompleteTasks] = useState(0);

  useEffect(() => {
    const fetchStudyActivitiesData = async () => {
      try {
        const response = await getStudyActivities();
        console.log('Fetched activities:', response.data);

        const activities = response.data.activities || [];
        setStudyActivities(activities);

        const { completedCount, incompleteCount } = calculateTaskStats(activities);
        const dueTodayCount = calculateTasksDueToday(activities);

        setTotalCompletedTasks(completedCount);
        setTotalIncompleteTasks(incompleteCount);
        setTasksDueToday(dueTodayCount);

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

  const calculateTasksDueToday = (tasks) => {
    const today = new Date();
    return tasks.filter(task => {
      const deadline = new Date(task.end_time);
      return deadline.toLocaleDateString() === today.toLocaleDateString();
    }).length;
  };

  const processChartData = (interval) => {
    const groupedData = {};
    const now = new Date();
    const startOfCurrentWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1)); // Start of current week (Monday)
  
    const dateToKey = (date, format) => {
      const options = {
        day: { weekday: 'short' },
        week: { week: 'numeric' },
        month: { month: 'short' },
      };
      return date.toLocaleDateString('en-US', options[format]);
    };
  
    const addDataPoint = (key) => {
      if (!groupedData[key]) {
        groupedData[key] = { name: key, completed: 0, incomplete: 0 };
      }
    };
  
    // Ensure all required periods are included
    if (interval === 'day') {
      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfCurrentWeek);
        day.setDate(startOfCurrentWeek.getDate() + i);
        const dayKey = dateToKey(day, 'day');
        addDataPoint(dayKey);
      }
    } else if (interval === 'week') {
      const weeks = 5; // Considering current month only
      for (let i = 1; i <= weeks; i++) {
        const weekKey = `W${i}`;
        addDataPoint(weekKey);
      }
    } else if (interval === 'month') {
      for (let i = 0; i < 12; i++) {
        const month = new Date(now.getFullYear(), i, 1);
        const monthKey = dateToKey(month, 'month');
        addDataPoint(monthKey);
      }
    }
  
    studyActivities.forEach((activity) => {
      const startDate = new Date(activity.start_time);
      const status = activity.status ? 'completed' : 'incomplete';
  
      switch (interval) {
        case 'day': {
          const dayKey = dateToKey(startDate, 'day');
          addDataPoint(dayKey);
          groupedData[dayKey][status]++;
          break;
        }
        case 'week': {
          const startOfMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
          const startWeekOffset = (startOfMonth.getDay() + 6) % 7; // Days to offset to reach Monday
          const weekOfMonth = Math.ceil((startDate.getDate() + startWeekOffset) / 7);
          const weekKey = `W${weekOfMonth}`;
          addDataPoint(weekKey);
          groupedData[weekKey][status]++;
          break;
        }
        case 'month': {
          const monthKey = dateToKey(startDate, 'month');
          addDataPoint(monthKey);
          groupedData[monthKey][status]++;
          break;
        }
        default:
          break;
      }
    });
  
    const sortedData = Object.values(groupedData).sort((a, b) => {
      switch (interval) {
        case 'day':
          return new Date(`${a.name}, ${now.getFullYear()}`) - new Date(`${b.name}, ${now.getFullYear()}`);
        case 'week':
          return parseInt(a.name.substring(1)) - parseInt(b.name.substring(1));
        case 'month':
          return new Date(`1 ${a.name} ${now.getFullYear()}`) - new Date(`1 ${b.name} ${now.getFullYear()}`);
        default:
          return 0;
      }
    });
  
    return sortedData;
  };  

  const handleIntervalChange = (event, newInterval) => {
    if (newInterval !== null) {
      setInterval(newInterval);
    }
  };

  const chartData = processChartData(interval);

  return (
    <Layout>
      <div className={`dashboard-container ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-red-100 text-black'}`}>
        <Grid container spacing={3}>
          {/* Bar Chart Section */}
          <Grid item xs={12}>
            <Paper className={`dashboard-card ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
              <Typography variant="h6" gutterBottom>
                Study Activities Over Time
              </Typography>
              <ToggleButtonGroup
                value={interval}
                exclusive
                onChange={handleIntervalChange}
                aria-label="interval selection"
                className="toggle-button-group"
              >
                <ToggleButton value="day" aria-label="daily" className={`toggle-button ${isDarkMode ? 'toggle-button-dark' : 'toggle-button-light'}`}>
                  Daily
                </ToggleButton>
                <ToggleButton value="week" aria-label="weekly" className={`toggle-button ${isDarkMode ? 'toggle-button-dark' : 'toggle-button-light'}`}>
                  Weekly
                </ToggleButton>
                <ToggleButton value="month" aria-label="monthly" className={`toggle-button ${isDarkMode ? 'toggle-button-dark' : 'toggle-button-light'}`}>
                  Monthly
                </ToggleButton>
              </ToggleButtonGroup>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#8884d8" />
                  <Bar dataKey="incomplete" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          {/* Progress Section */}
          <Grid item xs={12}>
            <Paper className={`dashboard-card ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
              <Typography variant="h6" gutterBottom>
                Progress
              </Typography>
              <LinearProgress variant="determinate" value={progress} />
              <Typography variant="body2" color={isDarkMode ? 'white' : 'textSecondary'}>{`${Math.round(progress)}%`}</Typography>
            </Paper>
          </Grid>
          {/* Tasks Due Today */}
          <Grid item xs={12} sm={4}>
            <Paper className={`dashboard-card ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
              <Typography variant="h6" gutterBottom>
                Tasks Due Today
              </Typography>
              <Typography variant="h4">{tasksDueToday}</Typography>
            </Paper>
          </Grid>
          {/* Total Completed Tasks */}
          <Grid item xs={12} sm={4}>
            <Paper className={`dashboard-card ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
              <Typography variant="h6" gutterBottom>
                Total Completed Tasks
              </Typography>
              <Typography variant="h4">{totalCompletedTasks}</Typography>
            </Paper>
          </Grid>
          {/* Total Incomplete Tasks */}
          <Grid item xs={12} sm={4}>
            <Paper className={`dashboard-card ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
              <Typography variant="h6" gutterBottom>
                Total Incomplete Tasks
              </Typography>
              <Typography variant="h4">{totalIncompleteTasks}</Typography>
            </Paper>
          </Grid>
          {/* Custom Calendar Component */}
          <Grid item xs={12}>
            <Paper className={`dashboard-card ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
              <Typography variant="h6" gutterBottom>
                Calendar
              </Typography>
              <CalendarComponent />
            </Paper>
          </Grid>
          {/* Course List Search */}
          <Grid item xs={12}>
            <CourseListSearch />
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default Dashboard;
