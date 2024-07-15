// FeedbackForm.js
import React, { useState } from 'react';
import axios from 'axios';

const FeedbackForm = ({ partnerId }) => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/feedback', { partnerId, feedback, rating }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Feedback submitted successfully!');
      setFeedback('');
      setRating(0);
    } catch (err) {
      setError('Error submitting feedback');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Rating:
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          min="1"
          max="5"
        />
      </label>
      <label>
        Feedback:
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
      </label>
      <button type="submit">Submit</button>
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </form>
  );
};

export default FeedbackForm;
