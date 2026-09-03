import httpClient from './httpClient'

/**
 * Admin API stubs — replace with real endpoints as backend sprints land.
 * Paths are relative to VITE_API_BASE_URL (/api/v1).
 */
export const adminApi = {
  getDashboardSummary: () => httpClient.get('/owner/dashboard'),
  getProfile: () => httpClient.get('/auth/me'),
  updateProfile: (payload) => httpClient.put('/owner/profile', payload),
  updateSettings: (payload) => httpClient.put('/owner/settings', payload),
}

export const authApi = {
  login: (payload) => httpClient.post('/auth/login', payload),
  register: (payload) => httpClient.post('/auth/register', payload),
  logout: () => httpClient.post('/auth/logout'),
  me: () => httpClient.get('/auth/me'),
  refresh: (payload) => httpClient.post('/auth/refresh', payload),
  forgotPassword: (payload) => httpClient.post('/auth/forgot-password', payload),
  resetPassword: (payload) => httpClient.post('/auth/reset-password', payload),
  changePassword: (payload) => httpClient.post('/auth/change-password', payload),
}

export default httpClient
