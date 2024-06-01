import axios from 'axios'
axios.defaults.withCredentials = true

export async function onRegistration(registrationData) {
  return await axios.post(
    'https://orbital-lake.vercel.app/api/register',
    registrationData
  )
}

export async function onLogin(loginData) {
  return await axios.post('https://orbital-lake.vercel.app/api/login', loginData)
}

export async function onLogout() {
  return await axios.get('https://orbital-lake.vercel.app/api/logout')
}

export async function fetchProtectedInfo() {
  return await axios.get('https://orbital-lake.vercel.app/api/protected')
}