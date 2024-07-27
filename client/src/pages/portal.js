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
  CircularProgress, 
  Alert, 
  Stack
} from '@mui/material';
import { useSelector } from 'react-redux';  // Import useSelector for Redux
import {
  uploadFileForMatchedUsers,
  getPortals,
  unMatchPartner,
  getFilesForMatchedUsers,
  getPortalByCourseCode
} from '../api/auth';
import Partner from '../components/Partner';
import Layout from '../components/layout';
import PrivateCourse from '../components/PrivateCourse';
import CloseIcon from '@mui/icons-material/Close';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import FeedbackForm from '../components/FeedbackForm'; 
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';


const Portals = () => {
  const isDarkMode = useSelector((state) => state.ui.isDarkMode);  // Access dark mode state from Redux
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
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [confirmUnmatchId, setConfirmUnmatchId] = useState(null);


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

  const handleUnmatch = (id) => {
    // Set the ID to be confirmed and open the dialog
    setConfirmUnmatchId(id);
    setOpenConfirmDialog(true);
  };
  
  const handleConfirmUnmatch = async () => {
    if (confirmUnmatchId) {
      try {
        await unMatchPartner(confirmUnmatchId);
        fetchPortals(); // Refresh portals after unmatching
        setSelectedPortalId(null); // Reset selectedPortalId after unmatching
      } catch (error) {
        console.error('Error unmatching partner:', error);
        alert('Error unmatching partner: ' + (error.response?.data?.error || error.message)); // Display error to the user
      }
      setConfirmUnmatchId(null);
    }
    setOpenConfirmDialog(false);
  };
  
  
  const handleCancelUnmatch = () => {
    setConfirmUnmatchId(null);
    setOpenConfirmDialog(false);
  };  

  const handleCloseFile = () => {
    setViewingFile(null);
  };

  const handleViewNote = (note) => {
    const fileBlob = new Blob([note.file_data], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(fileBlob);
    setViewingFile(fileURL);
  };

  const backgroundColor = isDarkMode ? '#1a202c' : 'white';
  const color = isDarkMode ? 'white' : 'black';
  const buttonColor = isDarkMode ? '#bb86fc' : '#3f51b5';
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
      <Container sx={{ backgroundColor, color }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Matched Courses
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Card sx={{ backgroundColor, color }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Upload File</Typography>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="File Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="outlined"
                  InputProps={{ style: { color } }}
                  InputLabelProps={{ style: { color } }}
                  sx={{ backgroundColor: isDarkMode ? '#333' : 'white' }}
                />
                <TextField
                  fullWidth
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  variant="outlined"
                  InputProps={{ style: { color } }}
                  InputLabelProps={{ style: { color } }}
                  sx={{ backgroundColor: isDarkMode ? '#333' : 'white' }}
                />
                <TextField
                  fullWidth
                  label="Course Code"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  variant="outlined"
                  InputProps={{ style: { color } }}
                  InputLabelProps={{ style: { color } }}
                  sx={{ backgroundColor: isDarkMode ? '#333' : 'white' }}
                />
                <TextField
                  fullWidth
                  label="Email 1"
                  value={email1}
                  onChange={(e) => setEmail1(e.target.value)}
                  variant="outlined"
                  InputProps={{ style: { color } }}
                  InputLabelProps={{ style: { color } }}
                  sx={{ backgroundColor: isDarkMode ? '#333' : 'white' }}
                />
                <TextField
                  fullWidth
                  label="Email 2"
                  value={email2}
                  onChange={(e) => setEmail2(e.target.value)}
                  variant="outlined"
                  InputProps={{ style: { color } }}
                  InputLabelProps={{ style: { color } }}
                  sx={{ backgroundColor: isDarkMode ? '#333' : 'white' }}
                />
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ margin: '10px 0' }}
                />
                <Button
      variant="contained"
      color="primary"
      onClick={handleUploadFile}
      disabled={uploading}
      sx={{
        backgroundColor: isDarkMode ? buttonColor : '#ff7961', // Red for light mode, buttonColor for dark mode
        '&:hover': {
          backgroundColor: isDarkMode ? '#6a1b9a' : '#d32f2f', // Dark purple for dark mode, dark red for light mode
        },
      }}
    >
      {uploading ? <CircularProgress size={24} /> : 'Upload'}
    </Button>
                {uploadSuccess && (
                  <Alert severity="success">File uploaded successfully!</Alert>
                )}
                {uploadError && (
                  <Alert severity="error">{uploadError}</Alert>
                )}
              </Stack>
            </CardContent>
          </Card>
          {portals.map((portal) => (
            <Card key={portal.id} sx={{ marginTop: 2, backgroundColor, color }}>
              <CardContent>
                <Typography variant="h6">{portal.course_code}</Typography>
                <Button
  variant="contained"
  color="primary"
  onClick={() => handleViewProfile(portal.id)}
  sx={{
    backgroundColor: isDarkMode ? '#6a1b9a' : '#f44336', // Purple for dark mode, Red for light mode
    color: 'white',
    marginRight: 1,
    '&:hover': {
      backgroundColor: isDarkMode ? '#4a148c' : '#c62828', // Darker shades on hover
    },
  }}
>
  {selectedPortalId === portal.id ? 'Hide Partner Profile' : 'View Partner Profile'}
</Button>
<Button
  variant="contained"
  color="secondary"
  onClick={() => handleUnmatch(portal.id)}
  sx={{
    backgroundColor: isDarkMode ? '#1e88e5' : '#ffeb3b', // Blue for dark mode, Yellow for light mode
    color: 'black',
    marginRight: 1,
    '&:hover': {
      backgroundColor: isDarkMode ? '#1565c0' : '#fbc02d', // Darker shades on hover
    },
  }}
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
                  <PrivateCourse courseCode={portal.course_code}/>
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
        {viewingFile && (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded shadow-lg max-w-3xl w-full h-full overflow-auto">
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer fileUrl={viewingFile} />
              </Worker>
              <Button
                onClick={handleCloseFile}
                sx={{ position: 'absolute', top: 4, right: 4 }}
                variant="contained"
                color="secondary"
              >
                Close
              </Button>
            </div>
          </div>
        )}
        <Dialog
  open={openConfirmDialog}
  onClose={handleCancelUnmatch}
  aria-labelledby="confirm-unmatch-dialog-title"
>
  <DialogTitle id="confirm-unmatch-dialog-title">
    Are you sure you want to unmatch?
  </DialogTitle>
  <DialogContent>
    <Typography>Do you really want to unmatch this partner? This action cannot be undone.</Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCancelUnmatch} color="primary">
      No
    </Button>
    <Button onClick={handleConfirmUnmatch} color="secondary">
      Yes
    </Button>
  </DialogActions>
</Dialog>

      </Container>
    </Layout>
  );
};

export default Portals;
