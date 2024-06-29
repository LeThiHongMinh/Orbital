import { useState } from 'react';
import { onRegistration } from '../api/auth';
import Layout from '../components/layout';
import { TextField, Button, Alert, Container, Typography, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { teal, red } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

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
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

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

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Box bgcolor="rgba(255, 0, 0, 0.1)" minHeight="100vh" pt={10}> {/* Added padding-top */}
          <Container maxWidth="sm">
            <Box
              component="form"
              onSubmit={onSubmit}
              className="flex flex-col space-y-6 bg-white p-6 rounded-lg shadow-md"
            >
              <Typography variant="h4" component="h1" className="text-center mb-4">
                Register
              </Typography>

              <TextField
                onChange={onChange}
                type="email"
                name="email"
                value={values.email}
                label="Email address"
                variant="outlined"
                required
                fullWidth
              />

              <TextField
                onChange={onChange}
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
