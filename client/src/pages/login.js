

import { useState } from 'react';
import { onLogin } from '../api/auth';
import Layout from '../components/layout';
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
  const [error, setError] = useState('');

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
      <Layout >
        <Box bgcolor="rgba(255, 0, 0, 0.1)" minHeight="100vh">
          <Container maxWidth="sm" className="flex items-center h-screen">
            <Box
              component="form"
              onSubmit={(e) => onSubmit(e)}
              className="flex flex-col space-y-6 bg-white p-6 rounded-lg shadow-md"
            >
              <Typography variant="h4" component="h1" className="text-center mb-4">
                Login
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

export default Login;
