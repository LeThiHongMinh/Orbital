import React, { useState } from 'react';
import { submitFeedback } from '../api/auth';

const FeedbackForm = ({ portalId }) => { // Receive partnerId as prop
  const [comments, setComments] = useState('');
  const [rating, setRating] = useState(1);
  const [feedbackSuccess, setFeedbackSuccess] = useState('');
  const [error, setError] = useState(null);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
  
    try {
      await submitFeedback(portalId, {
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

  const styles = {
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
    message: {
      color: '#e60000',
      textAlign: 'center',
      marginTop: '20px',
      fontSize: '20px'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Submit Feedback</h1>
      
      <form onSubmit={handleFeedbackSubmit} style={styles.feedbackForm}>
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
            onChange={(e) => setRating(Number(e.target.value))} // Ensure rating is a number
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
      {error && <p style={styles.message}>{error}</p>}
    </div>
  );
};

export default FeedbackForm;
