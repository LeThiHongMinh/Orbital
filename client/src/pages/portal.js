import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  TextField,
  Button,
  IconButton,
  List,
} from '@mui/material';
import {
  uploadFileForMatchedUsers,
  getPortals,
  unMatchPartner,
  getFilesForMatchedUsers,
  getPortalByCourseCode
} from '../api/auth';
import Layout from '../components/layout';
import Partner from '../components/Partner';
import CloseIcon from '@mui/icons-material/Close';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import FeedbackForm from '../components/FeedbackForm'; 
import PrivateCourse from '../components/PrivateCourse'

const Portals = () => {
  const [portals, setPortals] = useState([]);
  const [selectedPortalId, setSelectedPortalId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [email1, setEmail1] = useState('');
  const [email2, setEmail2] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [viewingFile, setViewingFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [courseNotes, setCourseNotes] = useState([]);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false); // State to control feedback form visibility
  const [feedbackPortalId, setFeedbackPortalId] = useState(null); // State to control feedback form for specific portal

  useEffect(() => {
    fetchPortals();
  }, []);

  const fetchPortals = async () => {
    setLoading(true);
    try {
      const response = await getPortals();
      setLoading(false);
      if (response.data && Array.isArray(response.data.portals)) {
        setPortals(response.data.portals);
      } else {
        console.error('Received invalid data for portals:', response.data);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching portals:', error);
    }
  };

  useEffect(() => {
    const fetchPrivateFiles = async () => {
      try {
        const response = await getFilesForMatchedUsers();
        if (response && response.data && response.data.files) {
          setCourseNotes(response.data.files);
          setFileError(null);
        } else {
          console.error('Invalid response format or missing files data:', response);
          setFileError('Error fetching file. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching files:', error);
        setFileError('Error fetching file. Please try again.');
      }
    };

    fetchPrivateFiles();
  }, []);

  const handleViewProfile = async (id) => {
    try {
      if (selectedPortalId === id) {
        setSelectedPortalId(null); // Unview the profile if already viewed
      } else {
        await getPortalByCourseCode(id);
        setSelectedPortalId(id); // Set the selected portal ID
      }
    } catch (error) {
      console.error('Error fetching partner profile:', error);
    }
  };

  const handleUploadFile = async () => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('courseCode', courseCode);
      formData.append('email1', email1);
      formData.append('email2', email2);

      const response = await uploadFileForMatchedUsers(formData);
      setUploadSuccess(true);
      setUploadError(null);
      fetchPortals();
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError('Error uploading file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleUnmatch = async (id) => {
    try {
      await unMatchPartner(id);
      fetchPortals(); // Refresh portals after unmatching
      setSelectedPortalId(null); // Reset selectedPortalId after unmatching
    } catch (error) {
      console.error('Error unmatching partner:', error);
      alert('Error unmatching partner: ' + (error.response?.data?.error || error.message)); // Display error to the user
    }
  };

  const handleViewFile = async () => {
    try {
      const response = await getFilesForMatchedUsers();
      if (response && response.data && response.data.files) {
        setCourseNotes(response.data.files);
        setFileError(null);
      } else {
        console.error('Invalid response format or missing files data:', response);
        setFileError('Error fetching file. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      setFileError('Error fetching file. Please try again.');
    }
  };

  const handleCloseFile = () => {
    setViewingFile(null);
  };

  const handleViewNote = (note) => {
    const fileBlob = new Blob([note.file_data], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(fileBlob);
    setViewingFile(fileURL);
  };

  const toggleFeedbackForm = async (id) => {
    if (feedbackPortalId === id) {
      setFeedbackPortalId(null); // Hide feedback form if already showing for this portal
    } else {
      await getPortalByCourseCode(id);
      setFeedbackPortalId(id); // Show feedback form for this portal
    }
  };

  return (
    <Layout>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Matched Courses
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Upload File</Typography>
              <TextField
                fullWidth
                label="File Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
                margin="normal"
                multiline
                rows={4}
              />
              <TextField
                fullWidth
                label="Course Code"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email 1"
                value={email1}
                onChange={(e) => setEmail1(e.target.value)}
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email 2"
                value={email2}
                onChange={(e) => setEmail2(e.target.value)}
                variant="outlined"
                margin="normal"
              />
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
              <Button
                variant="contained"
                color="primary"
                disabled={!file || !name || !description || !courseCode || !email1 || !email2 || uploading}
                onClick={handleUploadFile}
                style={{ marginTop: '10px' }}
              >
                {uploading ? 'Uploading...' : 'Upload File'}
              </Button>
              {uploadError && (
                <Typography variant="body1" color="error" sx={{ marginTop: 2 }}>
                  {uploadError}
                </Typography>
              )}
              {uploadSuccess && (
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  File uploaded successfully!
                </Typography>
              )}
            </CardContent>
          </Card>

          {loading && <Typography variant="body1">Loading...</Typography>}
          {portals.map((portal) => (
            <Card key={portal.id} sx={{ marginTop: 2 }}>
              <CardContent>
                <Typography variant="h6">{portal.course_code}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleViewProfile(portal.id)}
                  style={{ marginRight: '10px', marginTop: '10px' }}
                >
                  {selectedPortalId === portal.id ? 'Hide Partner Profile' : 'View Partner Profile'}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleUnmatch(portal.id)}
                  style={{ marginTop: '10px' }}
                >
                  Unmatch
                </Button>
                <Button
                  variant="contained"
                  onClick={handleViewFile}
                  style={{ marginTop: '10px' }}
                >
                  Notes
                </Button>
                <Button
                  variant="contained"
                  onClick={() => toggleFeedbackForm(portal.id)}
                  style={{ marginTop: '10px' }}
                >
                  {feedbackPortalId === portal.id ? 'Hide Feedback Form' : 'Show Feedback Form'}
                </Button>
              </CardContent>

              <CardContent>
                <Typography variant="h6">Course Notes</Typography>
                <List>
                  <PrivateCourse />
                </List>
              </CardContent>

              {selectedPortalId === portal.id && (
                <Box sx={{ marginTop: '20px' }}>
                  <Partner portalId={selectedPortalId} />
                </Box>
              )}

              {feedbackPortalId === portal.id && (
                <Box sx={{ marginTop: '20px' }}>
                  <FeedbackForm portalId={portal.id} /> {/* Pass portal ID if needed */}
                </Box>
              )}
            </Card>
          ))}

          {viewingFile && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
              }}
            >
              <Card
                sx={{
                  width: '90%',
                  height: '90%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <IconButton
                  onClick={handleCloseFile}
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    color: 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                  <Viewer fileUrl={viewingFile} />
                </Worker>
              </Card>
            </Box>
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export default Portals;
