import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Partner = () => {
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchMatchedUsers = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');

        // Include the token in the request headers
        const response = await axios.get('http://localhost:5000/api/yourpartner', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('Response:', response);

        if (response.data.success === false) {
          setMessage(response.data.message);
        } else {
          setMatchedUsers(response.data.matchedUsers);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching matched users:', error);
        setError(error.response?.data?.error || 'An error occurred while fetching matched users');
        setLoading(false);
      }
    };

    fetchMatchedUsers();
  }, []);

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

  if (message) {
    return <div style={styles.message}>{message}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Matched Users</h1>
      {matchedUsers.length === 0 ? (
        <div style={styles.noUsers}>No matched users found</div>
      ) : (
        <div style={styles.usersList}>
          {matchedUsers.map((match, index) => (
            <div key={index} style={styles.match}>
              <h2 style={styles.courseCode}>Course: {match.course_code}</h2>
              <div style={styles.userProfile}>
                <h3 style={styles.userProfileHeader}>Partner 1</h3>
                <p style={styles.userProfileText}>Name: {match.partner1.full_name}</p>
                <p style={styles.userProfileText}>Email: {match.partner1.email}</p>
                <p style={styles.userProfileText}>Bio: {match.partner1.bio}</p>
              </div>
              <div style={styles.userProfile}>
                <h3 style={styles.userProfileHeader}>Partner 2</h3>
                <p style={styles.userProfileText}>Name: {match.partner2.full_name}</p>
                <p style={styles.userProfileText}>Email: {match.partner2.email}</p>
                <p style={styles.userProfileText}>Bio: {match.partner2.bio}</p>
              </div>
              <p style={styles.status}>Status: {match.status ? 'Active' : 'Inactive'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Partner;
