import React, { useState } from 'react';
import { onLogin } from '../api/auth';
import Layout from '../components/layout'; // Assuming Layout is in './Layout'
import { useDispatch } from 'react-redux';
import { authenticateUser } from '../redux/slices/authSlice';
import { TextField, Button, Alert, Container, Typography, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { teal, red } from '@mui/material/colors';
import { NUSTudy } from '../assets/images';

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

const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(false);

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const dispatch = useDispatch();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await onLogin(values);
      dispatch(authenticateUser());
      localStorage.setItem('isAuth', 'true');
    } catch (error) {
      console.log(error.response.data.errors[0].msg);
      setError(error.response.data.errors[0].msg);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Box
          bgcolor="rgba(255, 0, 0, 0.1)"
          minHeight="100vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Container maxWidth="sm">
            <Box
              bgcolor="white"
              p={6}
              borderRadius={8}
              boxShadow={3}
              textAlign="center"
              sx={{ position: 'relative', top: '50%', transform: 'translateY(-50%)' }}
            >
              <Typography variant="h4" component="h1" gutterBottom>
                Login
              </Typography>

              <form onSubmit={onSubmit} noValidate>
                <TextField
                  onChange={onChange}
                  type="email"
                  name="email"
                  value={values.email}
                  label="Email address"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                />

                <TextField
                  onChange={onChange}
                  type="password"
                  name="password"
                  value={values.password}
                  label="Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                />

                {error && <Alert severity="error">{error}</Alert>}

                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                >
                  Submit
                </Button>
              </form>
            </Box>
          </Container>
        </Box>
      </Layout>
    </ThemeProvider>
  );
};

export default Login;
