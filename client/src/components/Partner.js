import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getPortalByCourseCode } from '../api/auth';

const Partner = ({ portalId }) => {
  const [matchedUsers, setMatchedUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatchedUsers = async () => {
      try {
        const response = await getPortalByCourseCode(portalId);
        setMatchedUsers(response.data.portal); // Assuming response structure matches expected data
        setLoading(false);
      } catch (error) {
        console.error('Error fetching matched users:', error);
        setError(error.response?.data?.error || 'An error occurred while fetching matched users');
        setLoading(false);
      }
    };

    if (portalId) {
      fetchMatchedUsers();
    } else {
      setLoading(false); // If no portalId, set loading to false
    }
  }, [portalId]);

  const styles = {
    container: {
      width: '80%',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
    },
    title: {
      textAlign: 'center',
      color: '#b71c1c',
      fontSize: '2.5em',
      marginBottom: '20px',
    },
    message: {
      textAlign: 'center',
      color: '#b71c1c',
      fontSize: '1.2em',
    },
    noUsers: {
      textAlign: 'center',
      color: '#b71c1c',
      fontSize: '1.5em',
      marginTop: '20px',
    },
    usersList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    match: {
      backgroundColor: '#fff',
      border: '2px solid #b71c1c',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    courseCode: {
      color: '#b71c1c',
      fontSize: '1.5em',
      marginBottom: '10px',
    },
    userProfile: {
      backgroundColor: '#ffebee',
      border: '1px solid #b71c1c',
      borderRadius: '5px',
      padding: '15px',
      marginBottom: '10px',
    },
    userProfileHeader: {
      color: '#b71c1c',
      marginBottom: '5px',
    },
    userProfileText: {
      margin: '5px 0',
    },
    status: {
      color: '#b71c1c',
      fontWeight: 'bold',
      textAlign: 'right',
    },
  };

  if (loading) {
    return <div style={styles.message}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.message}>Error: {error}</div>;
  }

  if (!matchedUsers) {
    return <div style={styles.message}>No matched users found</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Matched Users</h1>
      <div style={styles.usersList}>
        <div style={styles.match}>
          <h2 style={styles.courseCode}>Course: {matchedUsers.course_code}</h2>
          <div style={styles.userProfile}>
            <h3 style={styles.userProfileHeader}>Partner 1</h3>
            <p style={styles.userProfileText}>Name: {matchedUsers.partner1?.full_name || 'Unknown'}</p>
            <p style={styles.userProfileText}>Email: {matchedUsers.partner1?.email || 'Unknown'}</p>
            <p style={styles.userProfileText}>Bio: {matchedUsers.partner1?.bio || 'No bio provided'}</p>
          </div>
          <div style={styles.userProfile}>
            <h3 style={styles.userProfileHeader}>Partner 2</h3>
            <p style={styles.userProfileText}>Name: {matchedUsers.partner2?.full_name || 'Unknown'}</p>
            <p style={styles.userProfileText}>Email: {matchedUsers.partner2?.email || 'Unknown'}</p>
            <p style={styles.userProfileText}>Bio: {matchedUsers.partner2?.bio || 'No bio provided'}</p>
          </div>
          <p style={styles.status}>Status: {matchedUsers.status ? 'Active' : 'Inactive'}</p>
        </div>
      </div>
    </div>
  );
};

export default Partner;