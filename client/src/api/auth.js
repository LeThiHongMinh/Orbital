import axios from 'axios';

axios.defaults.withCredentials = true;

const API = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

export async function onRegistration(registrationData) {
  return await API.post('/api/register', registrationData);
}

export async function onLogin(loginData) {
  return await API.post('/api/login', loginData);
}

export async function onLogout() {
  return await API.get('/api/logout');
}

export async function fetchProtectedInfo() {
  return await API.get('/api/protected');
}
