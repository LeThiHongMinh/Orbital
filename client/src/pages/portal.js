import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Button, Box } from '@mui/material';
import { getPortals, getPortalByCourseCode, unMatchPartner } from '../api/auth';
import Layout from '../components/layout';
import Partner from '../components/Partner'; // Import the Partner component

const Portals = () => {
  const [portals, setPortals] = useState([]);
  const [selectedPortalId, setSelectedPortalId] = useState(null); // Track selected portal ID
  const [loading, setLoading] = useState(false); // Optional: Add loading state
  const [viewingProfileId, setViewingProfileId] = useState(null); // Track which profile is currently being viewed

  useEffect(() => {
    fetchPortals();
  }, []);

  const fetchPortals = async () => {
    setLoading(true);
    try {
      const response = await getPortals();
      setLoading(false); // Disable loading indicator
      // Ensure response.data is an array before setting state
      if (response.data && Array.isArray(response.data.portals)) {
        setPortals(response.data.portals);
      } else {
        console.error('Received invalid data for portals:', response.data);
      }
    } catch (error) {
      setLoading(false); // Disable loading indicator on error
      console.error('Error fetching portals:', error);
    }
  };

  const handleViewProfile = async (id) => {
    try {
      if (selectedPortalId === id) {
        setSelectedPortalId(null); // Unview the profile if already viewed
      } else {
        const response = await getPortalByCourseCode(id);
        setSelectedPortalId(id); // Set the selected portal ID
      }
    } catch (error) {
      console.error('Error fetching partner profile:', error);
    }
  };

  const handleUnmatch = async (id) => {
    try {
      await unMatchPartner(id);
      fetchPortals(); // Refresh portals after unmatching
      setSelectedPortalId(null); // Reset selectedPortalId after unmatching
    } catch (error) {
      console.error('Error unmatching partner:', error);
      alert('Error unmatching partner: ' + error.response?.data?.error || error.message); // Display error to the user
    }
  };

  return (
    <Layout>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Matched Courses
        </Typography>
        {loading && <Typography variant="body1">Loading...</Typography>} {/* Optional loading indicator */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {portals.length > 0 ? (
            portals.map((portal) => (
              <Card key={portal.id}>
                <CardContent>
                  <Typography variant="h6">{portal.course_code}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewProfile(portal.id)}
                    style={{ marginRight: '10px' }}
                  >
                    {selectedPortalId === portal.id ? 'Unview Partner Profile' : 'View Partner Profile'}
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleUnmatch(portal.id)}
                  >
                    Unmatch Partner
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body1">No matched courses found.</Typography>
          )}
        </Box>
        {/* Render Partner component when selectedPortalId is set */}
        {selectedPortalId && (
          <Box sx={{ marginTop: '20px' }}>
            <Partner portalId={selectedPortalId} /> {/* Pass selectedPortalId as prop */}
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default Portals;
