import React, { useEffect, useState } from 'react';
import { Typography, TextField, List, ListItem, ListItemText } from '@mui/material';
import { getMatchedPartner } from '../api/auth';

const CourseListSearch = () => {
  const [matchedCourses, setMatchedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const styles = {
    container: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
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
  };

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
        label="Search Courses"
        onChange={handleSearch}
        fullWidth
        style={styles.searchInput}
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
                  secondary={`Partner 1: ${course.partner1.full_name}, Partner 2: ${course.partner2.full_name}`}
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
