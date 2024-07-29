import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector to access dark mode state
import Layout from '../components/layout'; // Assuming you have a Layout component
import { getNotifications } from '../api/auth';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  // Access dark mode state from Redux
  const isDarkMode = useSelector(state => state.ui.isDarkMode);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <Layout>
      <main className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
        <h1 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h1>
        <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
          {notifications.length === 0 ? (
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No notifications found.</p>
          ) : (
            <ul>
              {notifications.map((notification) => (
                <li key={notification.id} className={`border-b py-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                  <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{notification.description}</div>
                  {notification.course_code && (
                    <div className={`text-gray-400 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Course: {notification.course_code}</div>
                  )}
                  <div className={`text-gray-500 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{new Date(notification.created_at).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default NotificationsPage;
