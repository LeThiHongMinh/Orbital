import React, { useEffect, useState } from 'react';
import { LinearProgress, Typography, TextField } from '@mui/material';
import { deve } from '../assets/images';

const ProgressBar = ({ completedTasks, totalTasks }) => {
  const [progress, setProgress] = useState(0); // Initial progress value

  useEffect(() => {
    if (totalTasks > 0) {
      setProgress((completedTasks / totalTasks) * 100);
    }
  }, [completedTasks, totalTasks]);

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
          Progress: {progress.toFixed(2)}%
        </Typography>
      </div>
    </div>
  );
};

export default ProgressBar;
