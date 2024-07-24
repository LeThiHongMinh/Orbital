import axios from 'axios';

axios.defaults.withCredentials = true;

const API = axios.create({
  baseURL: 'https://orbital-kq4q.onrender.com',
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
  return await API.put('/api/profileupdate', profileData,{
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  } );
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
  return await API.get(`/api/yourpartner`);
}

export async function getMatchedPartnerById(id) {
  return await API.get(`/api/yourpartner/${id}`);
}

export async function submitFeedback(id, feedbackData) {
  return await API.post(`/api/submit-feedback/${id}`, feedbackData);
}

export const getFilesForMatchedUsers = async () => {
    return await API.get('/api/matched-files');

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

export async function contactUs(formData) {
  return await API.post(`/api/contact-us`, formData);
}

export async function getNotifications() {
  return await API.get(`/api/noti`);
}
