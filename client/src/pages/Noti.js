import React, { useState, useEffect } from 'react';
import Layout from '../components/layout'; // Assuming you have a Layout component
import { getNotifications } from '../api/auth';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

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
      <main className="bg-gray-100 min-h-screen p-6">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
  {notifications.length === 0 ? (
    <p>No notifications found.</p>
  ) : (
    <ul>
      {notifications.map((notification) => (
        <li key={notification.id} className="border-b py-4">
          <div className="font-semibold">{notification.description}</div>
          {notification.course_code && (
            <div className="text-gray-600">Course: {notification.course_code}</div>
          )}
          <div className="text-gray-500">{new Date(notification.created_at).toLocaleString()}</div>
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
