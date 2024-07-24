import React, { useEffect, useState } from 'react';
import { Typography, TextField, List, ListItem, ListItemText } from '@mui/material';
import { useSelector } from 'react-redux';
import { getMatchedPartner } from '../api/auth';

const CourseListSearch = () => {
  const [matchedCourses, setMatchedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const isDarkMode = useSelector((state) => state.ui.isDarkMode); // Access dark mode state from Redux store

  useEffect(() => {
    const fetchMatchedCourses = async () => {
      try {
        const response = await getMatchedPartner();
        console.log('Response:', response);

        if (response.data.success === false) {
          setError(response.data.message);
        } else {
          setMatchedCourses(response.data.matchedUsers);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching matched courses:', error);
        setError(error.response?.data?.error || 'An error occurred while fetching matched courses');
        setLoading(false);
      }
    };

    fetchMatchedCourses();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCourses = matchedCourses.filter((course) =>
    course.course_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Define styles for light and dark modes
  const lightModeStyles = {
    container: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      color: '#000',
    },
    title: {
      color: '#b71c1c',
      fontSize: '1.5em',
      marginBottom: '10px',
    },
    searchInput: {
      marginBottom: '20px',
    },
    courseList: {
      backgroundColor: '#fff',
      border: '2px solid #b71c1c',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    courseItem: {
      backgroundColor: '#ffebee',
      border: '1px solid #b71c1c',
      borderRadius: '5px',
      padding: '15px',
      marginBottom: '10px',
    },
    searchLabel: {
      color: '#b71c1c',
    },
    partnerName: {
      color: '#000',
    },
  };

  const darkModeStyles = {
    container: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#121212',
      color: '#e0e0e0',
    },
    title: {
      color: '#bb86fc',
      fontSize: '1.5em',
      marginBottom: '10px',
    },
    searchInput: {
      marginBottom: '20px',
    },
    courseList: {
      backgroundColor: '#1e1e1e',
      border: '2px solid #bb86fc',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    },
    courseItem: {
      backgroundColor: '#333',
      border: '1px solid #bb86fc',
      borderRadius: '5px',
      padding: '15px',
      marginBottom: '10px',
    },
    searchLabel: {
      color: '#bb86fc', // Brighter color for dark mode
    },
    partnerName: {
      color: '#e0e0e0', // Brighter color for partner names in dark mode
    },
  };

  // Use dark mode styles if dark mode is enabled
  const styles = isDarkMode ? darkModeStyles : lightModeStyles;

  if (loading) {
    return <Typography style={styles.title}>Loading...</Typography>;
  }

  if (error) {
    return <Typography style={styles.title}>Error: {error}</Typography>;
  }

  return (
    <div style={styles.container}>
      <Typography style={styles.title}>Course List Search</Typography>
      <TextField
        variant="outlined"
        label={<span style={styles.searchLabel}>Search Courses</span>}
        onChange={handleSearch}
        fullWidth
        style={styles.searchInput}
        InputProps={{
          style: {
            color: isDarkMode ? '#e0e0e0' : '#000',
            borderColor: isDarkMode ? '#bb86fc' : '#b71c1c',
          },
        }}
      />
      <div style={styles.courseList}>
        {filteredCourses.length === 0 ? (
          <Typography>No matched courses found</Typography>
        ) : (
          <List>
            {filteredCourses.map((course, index) => (
              <ListItem key={index} style={styles.courseItem}>
                <ListItemText
                  primary={`Course: ${course.course_code}`}
                  secondary={
                    <div>
                      <Typography style={styles.partnerName}>
                        Partner 1: {course.partner1.full_name}
                      </Typography>
                      <Typography style={styles.partnerName}>
                        Partner 2: {course.partner2.full_name}
                      </Typography>
                    </div>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </div>
    </div>
  );
};

export default CourseListSearch;
