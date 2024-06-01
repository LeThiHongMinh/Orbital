import axios from 'axios'
axios.defaults.withCredentials = true

export async function onRegistration(registrationData) {
  return await axios.post(
    'https://orbital-kq4q.onrender.com/api/register',
    registrationData
  )
}

export async function onLogin(loginData) {
  return await axios.post('https://orbital-kq4q.onrender.com/api/login', loginData)
}

export async function onLogout() {
  return await axios.get('https://orbital-kq4q.onrender.com/api/logout')
}

export async function fetchProtectedInfo() {
  return await axios.get('https://orbital-kq4q.onrender.com/api/protected')
}