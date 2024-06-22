import { useState, useEffect } from 'react'; 
import { onRegistration, verifyEmail } from '../api/auth'; // Add verifyEmail API call
import Layout from '../components/layout';
import { TextField, Button, Alert, Container, Typography, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { teal, red } from '@mui/material/colors';
import { useLocation, useNavigate } from 'react-router-dom'; // Import hooks for routing

const theme = createTheme({
  palette: {
    primary: {
      main: teal[500],
    },
    secondary: {
      main: red[500], // Light red color
    },
  },
  typography: {
    fontFamily: '"Palaquin", sans-serif',
  },
});

const Register = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');

  const navigate = useNavigate(); // Initialize navigate hook
  const location = useLocation(); // Initialize location hook

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await onRegistration(values);

      setError('');
      setSuccess(data.message);
      setValues({ email: '', password: '' });
    } catch (error) {
      setError(error.response.data.errors[0].msg);
      setSuccess('');
    }
  };

  const handleVerification = async (token) => {
    try {
      const { data } = await verifyEmail(token);
      setVerificationMessage(data.message);
      setError('');
    } catch (error) {
      setError('Verification failed. Please try again.');
      setVerificationMessage('');
    }
  };

  // Check for verification token in URL
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    if (token) {
      handleVerification(token);
    }
  }, [location]);

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Box bgcolor="rgba(255, 0, 0, 0.1)" minHeight="100vh">
          <Container maxWidth="sm" className="flex items-center justify-center h-screen">
            <Box
              component="form"
              onSubmit={(e) => onSubmit(e)}
              className="flex flex-col space-y-6 bg-white p-6 rounded-lg shadow-md"
            >
              <Typography variant="h4" component="h1" className="text-center mb-4">
                Register
              </Typography>

              <TextField
                onChange={(e) => onChange(e)}
                type="email"
                name="email"
                value={values.email}
                label="Email address"
                variant="outlined"
                required
                fullWidth
              />

              <TextField
                onChange={(e) => onChange(e)}
                type="password"
                name="password"
                value={values.password}
                label="Password"
                variant="outlined"
                required
                fullWidth
              />

              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}
              {verificationMessage && <Alert severity="success">{verificationMessage}</Alert>}

              <Button type="submit" variant="contained" color="secondary" fullWidth>
                Submit
              </Button>
            </Box>
          </Container>
        </Box>
      </Layout>
    </ThemeProvider>
  );
};

export default Register;
