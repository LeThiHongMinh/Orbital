import React, { useState } from 'react';
import { LinearProgress, Typography, TextField } from '@mui/material';
import { deve } from '../assets/images';

const ProgressBar = () => {
  const [progress, setProgress] = useState(0); // Initial progress value
  const [inputValue, setInputValue] = useState(''); // State to hold the input value

  // Function to handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setProgress(Number(inputValue)); // Convert input value to number and set progress
    setInputValue(''); // Clear input field after submission
  };

  return (
    <div className="fixed top-0 left-0 right-0 flex items-center justify-center p-6">
      <div className="bg-red-200 p-6 rounded-lg shadow-lg max-w-3xl w-full">
        <img
          src={deve}
          alt="NUSTudy Logo"
          width={200}
          height={200}
          className="mb-4 mx-auto"
        />
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 30, // Increased height
            borderRadius: 8,
            '& .MuiLinearProgress-bar': {
              borderRadius: 8,
            },
          }}
        />
        <Typography variant="h6" color="textSecondary" align="center" className="mt-2">
          Progress: {progress}%
        </Typography>
        <form onSubmit={handleSubmit} className="mt-4">
          <TextField
            label="Enter Progress (%)"
            variant="outlined"
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            fullWidth
          />
        </form>
      </div>
    </div>
  );
};

export default ProgressBar;
