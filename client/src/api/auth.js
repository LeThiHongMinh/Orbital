// api/auth.js

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
  try {
    const response = await API.post('/api/login', loginData);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;  // Re-throw the error for the calling component to handle
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

export async function profileUpdate(profileData) {
  return await API.put('/api/profileupdate', profileData);
}

export async function profileCheck() {
  return await API.get('/api/profile');
}

export async function createStudyActivity(activityData) {
  return await API.post('/api/study-activities', activityData);
}

export async function getStudyActivities() {
  return await API.get('/api/study-activities');
}

export async function getStudyActivity(id) {
  return await API.get(`/api/study-activities/${id}`);
}

export async function updateStudyActivity(id, activityData) {
  return await API.put(`/api/study-activities/${id}`, activityData);
}

export async function deleteStudyActivity(id) {
  return await API.delete(`/api/study-activities/${id}`);
}

export async function toggleStudyActivityStatus(id) {
  return await API.patch(`/api/study-activities/${id}/toggle-status`, {});
}

export async function getNotes() {
  return await API.get('/api/files');
}

export async function downloadNotes(fileId) {
  try {
    const response = await API.get(`/api/files/${fileId}/download`, {
      responseType: 'blob',
    });
    return response.data;  // Return the blob data
  } catch (error) {
    throw error;  // Throw error to be handled in the calling component
  }
}

export async function getPortals() {
  return await API.get(`/api/portal`);
}

export async function getPortalByCourseCode(id) {
  return await API.get(`/api/portal/${id}`);
}

export async function unMatchPartner(id) {
  return await API.delete(`/api/portal/${id}/unmatch`); 
}


export async function getMatchedPartner() {
  return await API.get('/api/yourpartner');
}

export async function submitFeedback(feedbackData) {
  return await API.post('/api/submit-feedback', feedbackData);
}

export const getFilesForMatchedUsers = async (courseCode) => {
  try {
    const response = await API.get(`/api/matched-files/${courseCode}`);
    return response.data; // Assuming backend returns { success: true, file: { file_data: ... } }
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error; // Handle errors in the calling component
  }
};
export async function uploadFileForMatchedUsers(formData) {
  try {
    const response = await API.post(`/api/upload-matched-file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data; // Assuming backend returns { success: true, fileId: '...' }
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error; // Handle errors in the calling component
  }
}