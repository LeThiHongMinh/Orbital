import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Box, TextField, Button, IconButton } from '@mui/material';
import { uploadFileForMatchedUsers, getPortals, unMatchPartner, getFilesForMatchedUsers } from '../api/auth';
import Layout from '../components/layout';
import Partner from '../components/Partner';
import CloseIcon from '@mui/icons-material/Close';

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
      setSelectedPortalId(id);
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

  const handleUnmatch = async (email, courseCode) => {
    try {
      await unMatchPartner(email, courseCode);
      fetchPortals();
    } catch (error) {
      console.error('Error unmatching users:', error);
    }
  };

  const handleViewFile = async (courseCode) => {
    try {
      const response = await getFilesForMatchedUsers(courseCode);
      const file = response.file;
      const fileBlob = new Blob([file.file_data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(fileBlob);
      setViewingFile(fileURL);
      setFileError(null);
    } catch (error) {
      console.error('Error fetching file:', error);
      setFileError('Error fetching file. Please try again.');
    }
  };

  const handleCloseFile = () => {
    setViewingFile(null);
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
          {portals.length > 0 ? (
            portals.map((portal) => (
              <Card key={portal.id}>
                <CardContent>
                  <Typography variant="h6">{portal.course_code}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewProfile(portal.id)}
                    style={{ marginRight: '10px', marginTop: '10px' }}
                  >
                    View Partner Profile
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleUnmatch(portal.email, portal.course_code)}
                    style={{ marginTop: '10px' }}
                  >
                    Unmatch
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleViewFile(portal.course_code)}
                    style={{ marginTop: '10px' }}
                  >
                    View PDF
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body1">No matched courses found</Typography>
          )}
        </Box>

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
              <embed src={viewingFile} type="application/pdf" width="100%" height="100%" />
            </Card>
          </Box>
        )}

        {selectedPortalId && (
          <Box sx={{ marginTop: '20px' }}>
            <Partner portalId={selectedPortalId} />
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default Portals;
