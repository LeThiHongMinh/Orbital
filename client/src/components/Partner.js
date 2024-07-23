import React, { useEffect, useState } from 'react';
import { getMatchedPartnerById } from '../api/auth';

const Partner = ({ portalId }) => {
  const [matchedUsers, setMatchedUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatchedUsers = async () => {
      try {
        const response = await getMatchedPartnerById(portalId);
        if (response.data && response.data.matchedUsers) {
          setMatchedUsers(response.data.matchedUsers);
        } else {
          setError('No matched users found');
        }
      } catch (error) {
        console.error('Error fetching matched users:', error);
        setError('Error fetching matched users');
      } finally {
        setLoading(false);
      }
    };

    if (portalId) {
      fetchMatchedUsers();
    } else {
      setLoading(false);
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
    avatar: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      border: '2px solid #b71c1c',
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

  const { partner1, partner2, course_code } = matchedUsers;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Matched Users</h1>
      <div style={styles.userProfile}>
        <h2 style={styles.userProfileHeader}>Course: {course_code}</h2>
        <div>
          <h3 style={styles.userProfileHeader}>Partner 1</h3>
          <p style={styles.userProfileText}>Name: {partner1?.full_name || 'Unknown'}</p>
          <p style={styles.userProfileText}>Email: {partner1?.email || 'Unknown'}</p>
          <p style={styles.userProfileText}>Bio: {partner1?.bio || 'No bio provided'}</p>
          <p style={styles.userProfileText}>Telegram: {partner1?.tele || 'No telegram handle'}</p>
          <img 
            src={partner1?.avatar || 'https://i.pinimg.com/564x/40/27/ef/4027ef3433c0541374a41c841d9c26eb.jpg'} 
            alt="Partner 1 Avatar" 
            style={styles.avatar} 
          />
        </div>
        <div>
          <h3 style={styles.userProfileHeader}>Partner 2</h3>
          <p style={styles.userProfileText}>Name: {partner2?.full_name || 'Unknown'}</p>
          <p style={styles.userProfileText}>Email: {partner2?.email || 'Unknown'}</p>
          <p style={styles.userProfileText}>Bio: {partner2?.bio || 'No bio provided'}</p>
          <p style={styles.userProfileText}>Telegram: {partner2?.tele || 'No telegram handle'}</p>
          <img 
            src={partner2?.avatar || 'https://i.pinimg.com/564x/40/27/ef/4027ef3433c0541374a41c841d9c26eb.jpg'} 
            alt="Partner 2 Avatar" 
            style={styles.avatar} 
          />
        </div>
        <p style={styles.status}>Status: {matchedUsers.status ? 'Active' : 'Inactive'}</p>
      </div>
    </div>
  );
};

export default Partner;
