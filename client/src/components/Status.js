import React, { useEffect, useState } from 'react';
import { getStudyActivities } from '../api/auth'; // Adjust import as per your API setup
import './Status.css'; // Import the CSS file

const StatusComponent = () => {
  const [studyActivities, setStudyActivities] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [incompleteCount, setIncompleteCount] = useState(0);
  const [totalHoursStudied, setTotalHoursStudied] = useState(0);

  useEffect(() => {
    // Fetch study activities from backend or API
    const fetchData = async () => {
      try {
        const response = await getStudyActivities(); // Implement fetchStudyActivities as per your API
        setStudyActivities(response.data); // Assuming response.data is an array of study activities

        // Calculate task stats and total hours studied
        const { completedCount, incompleteCount } = calculateTaskStats(response.data);
        const totalHours = calculateTotalHoursStudied(response.data);

        setCompletedCount(completedCount);
        setIncompleteCount(incompleteCount);
        setTotalHoursStudied(totalHours);
      } catch (error) {
        console.error('Error fetching study activities:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Study Activities Dashboard</h2>
      <div className="dashboard">
        <div className="card">
          <div className="card-title">Completed Tasks</div>
          <div className="card-content">{completedCount}</div>
        </div>
        <div className="card">
          <div className="card-title">Incomplete Tasks</div>
          <div className="card-content">{incompleteCount}</div>
        </div>
        <div className="card">
          <div className="card-title">Total Hours Studied</div>
          <div className="card-content">{totalHoursStudied} hours</div>
        </div>
      </div>
      {/* Render study activities list or other components as needed */}
    </div>
  );
};

const calculateTaskStats = (studyActivities) => {
  let completedCount = 0;
  let incompleteCount = 0;

  studyActivities.forEach(activity => {
    if (activity.status === 'completed') {
      completedCount++;
    } else if (activity.status === 'incomplete') {
      incompleteCount++;
    }
  });

  return { completedCount, incompleteCount };
};

const calculateTotalHoursStudied = (studyActivities) => {
  let totalHours = 0;

  studyActivities.forEach(activity => {
    totalHours += activity.hoursStudied;
  });

  return totalHours;
};

export default StatusComponent;
