import axios from 'axios';

axios.defaults.withCredentials = true;

const API = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };
};

export async function onRegistration(registrationData) {
  return await API.post('/api/register', registrationData);
}

export const verifyEmail = (token) => {
  return axios.get(`/api/verify-email?token=${token}`);
};

export async function onLogin(loginData) {
  try {
    const response = await API.post('/api/login', loginData);
    localStorage.setItem('token', response.data.token);
    return response;
  } catch (error) {
    console.error('Login error:', error);
  }
}

export async function onLogout() {
  return await API.get('/api/logout');
}

export async function fetchProtectedInfo() {
  return await API.get('/api/protected');
}
export async function submitForm(formData) {
  return await API.post('/api/submit-form', formData);
}

export async function profileUpdate (profileData) {
  return await API.put('/api/profileupdate', profileData, getAuthHeader());
}
export async function profileCheck() {
  return await API.get('/api/profile', getAuthHeader());
}

export async function createStudyActivity(activityData) {
  return await API.post('/api/study-activities', activityData, getAuthHeader());
}

export async function getStudyActivities() {
  return await API.get('/api/study-activities', getAuthHeader());
}

export async function getStudyActivity(id) {
  return await API.get(`/api/study-activities/${id}`, getAuthHeader());
}

export async function updateStudyActivity(id, activityData) {
  return await API.put(`/api/study-activities/${id}`, activityData, getAuthHeader());
}

export async function deleteStudyActivity(id) {
  return await API.delete(`/api/study-activities/${id}`, getAuthHeader());
}
export async function getNotes() {
  return await API.get('/api/files');
}
export async function downloadNotes(fileId) {
  try {
    const response = await API.get(`/api/files/${fileId}/download`, {
      responseType: 'blob'
    });
    return response.data; // Return the blob data
  } catch (error) {
    throw error; // Throw error to be handled in calling component
  }
}