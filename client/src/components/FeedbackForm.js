import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getMatchedPartner, submitFeedback } from '../api/auth'; // Assuming you have an api/auth.js file with these functions

const FeedbackForm = () => {
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState('');
  const [comments, setComments] = useState('');
  const [rating, setRating] = useState(1);

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

      // Refresh matched users after submitting feedback
       // Assuming you have a function to refetch matched users

    } catch (error) {
      console.error('Error submitting feedback:', error.response?.data?.error || error.message);
      setError('Error submitting feedback. Please try again later.');
    }
  };

  const styles = {
    container: {
      // Your container styles
    },
    title: {
      // Your title styles
    },
    noUsers: {
      // Your no users styles
    },
    usersList: {
      // Your users list styles
    },
    match: {
      // Your match styles
    },
    courseCode: {
      // Your course code styles
    },
    userProfile: {
      // Your user profile styles
    },
    userProfileHeader: {
      // Your user profile header styles
    },
    userProfileText: {
      // Your user profile text styles
    },
    status: {
      // Your status styles
    },
    message: {
      // Your message styles
    }
    // Add more styles as needed
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

              {/* Feedback Form */}
              <form onSubmit={handleFeedbackSubmit}>
                <h3>Submit Feedback</h3>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Enter your feedback"
                  required
                />
                <label>
                  Rating:
                  <select value={rating} onChange={(e) => setRating(e.target.value)} required>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </label>
                <button type="submit">Submit Feedback</button>
              </form>

              {feedbackSuccess && <p style={{ color: 'green' }}>{feedbackSuccess}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;
