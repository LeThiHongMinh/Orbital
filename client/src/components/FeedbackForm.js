import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector to access Redux state
import { getMatchedPartner, submitFeedback } from '../api/auth';

const FeedbackForm = () => {
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState('');
  const [comments, setComments] = useState('');
  const [rating, setRating] = useState(1);

  const isDarkMode = useSelector((state) => state.ui.isDarkMode); // Access dark mode state from Redux store

  useEffect(() => {
    const fetchMatchedUsers = async () => {
      try {
        const response = await getMatchedPartner();
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

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    try {
      const selectedMatch = matchedUsers[0]; // Assuming you're selecting the first match
      const partnerId = selectedMatch.partner2.user_id; // Adjust this based on your logic

      await submitFeedback({
        partnerId,
        comments,
        rating,
      });

      setFeedbackSuccess('Feedback submitted successfully');
      setComments('');
      setRating(1);
    } catch (error) {
      console.error('Error submitting feedback:', error.response?.data?.error || error.message);
      setError('Error submitting feedback. Please try again later.');
    }
  };

  // Define styles for light and dark modes
  const lightModeStyles = {
    container: {
      backgroundColor: '#fff5f5',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      maxWidth: '900px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    },
    title: {
      color: '#e60000',
      textAlign: 'center',
      marginBottom: '20px',
      fontSize: '32px'
    },
    noUsers: {
      color: '#e60000',
      textAlign: 'center',
      fontSize: '20px'
    },
    usersList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    match: {
      border: '1px solid #e60000',
      borderRadius: '10px',
      padding: '30px',
      backgroundColor: '#ffcccc',
    },
    courseCode: {
      color: '#b30000',
      fontWeight: 'bold',
      fontSize: '20px',
      marginBottom: '10px',
    },
    userProfile: {
      marginBottom: '10px',
    },
    userProfileHeader: {
      color: '#b30000',
      fontWeight: 'bold',
      fontSize: '18px',
      marginBottom: '5px',
    },
    userProfileText: {
      color: '#800000',
      marginBottom: '5px',
      fontSize: '16px'
    },
    status: {
      color: '#b30000',
      fontWeight: 'bold',
      marginBottom: '10px',
      fontSize: '18px'
    },
    message: {
      color: '#e60000',
      textAlign: 'center',
      marginTop: '20px',
      fontSize: '20px'
    },
    feedbackForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginTop: '10px',
    },
    feedbackTextarea: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #e60000',
      resize: 'vertical',
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px'
    },
    feedbackSelect: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #e60000',
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px'
    },
    feedbackButton: {
      padding: '15px 30px',
      borderRadius: '5px',
      border: 'none',
      backgroundColor: '#e60000',
      color: '#fff',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px'
    },
    feedbackSuccess: {
      color: 'green',
      marginTop: '10px',
      fontSize: '18px'
    },
  };

  const darkModeStyles = {
    container: {
      backgroundColor: '#121212',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      maxWidth: '900px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      color: '#e0e0e0'
    },
    title: {
      color: '#bb86fc',
      textAlign: 'center',
      marginBottom: '20px',
      fontSize: '32px'
    },
    noUsers: {
      color: '#bb86fc',
      textAlign: 'center',
      fontSize: '20px'
    },
    usersList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    match: {
      border: '1px solid #bb86fc',
      borderRadius: '10px',
      padding: '30px',
      backgroundColor: '#333',
    },
    courseCode: {
      color: '#bb86fc',
      fontWeight: 'bold',
      fontSize: '20px',
      marginBottom: '10px',
    },
    userProfile: {
      marginBottom: '10px',
    },
    userProfileHeader: {
      color: '#bb86fc',
      fontWeight: 'bold',
      fontSize: '18px',
      marginBottom: '5px',
    },
    userProfileText: {
      color: '#e0e0e0',
      marginBottom: '5px',
      fontSize: '16px'
    },
    status: {
      color: '#bb86fc',
      fontWeight: 'bold',
      marginBottom: '10px',
      fontSize: '18px'
    },
    message: {
      color: '#bb86fc',
      textAlign: 'center',
      marginTop: '20px',
      fontSize: '20px'
    },
    feedbackForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginTop: '10px',
    },
    feedbackTextarea: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #bb86fc',
      resize: 'vertical',
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      color: '#e0e0e0',
      backgroundColor: '#333'
    },
    feedbackSelect: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #bb86fc',
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      color: '#e0e0e0',
      backgroundColor: '#333'
    },
    feedbackButton: {
      padding: '15px 30px',
      borderRadius: '5px',
      border: 'none',
      backgroundColor: '#bb86fc',
      color: '#000',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px'
    },
    feedbackSuccess: {
      color: 'lightgreen',
      marginTop: '10px',
      fontSize: '18px'
    },
  };

  // Use dark mode styles if dark mode is enabled
  const styles = isDarkMode ? darkModeStyles : lightModeStyles;

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

              {/* Feedback Form */}
              <form onSubmit={handleFeedbackSubmit} style={styles.feedbackForm}>
                <h3>Submit Feedback</h3>
                <textarea
                  style={styles.feedbackTextarea}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Enter your feedback"
                  required
                />
                <label>
                  Rating:
                  <select
                    style={styles.feedbackSelect}
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    required
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </label>
                <button type="submit" style={styles.feedbackButton}>Submit Feedback</button>
              </form>

              {feedbackSuccess && <p style={styles.feedbackSuccess}>{feedbackSuccess}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;
