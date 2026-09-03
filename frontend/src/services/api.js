import httpClient from './httpClient'

export const adminApi = {
 getDashboardSummary: () => httpClient.get('/admin/dashboard'),
 getProfile: () => httpClient.get('/admin/profile'),
 updateProfile: (payload) => httpClient.put('/admin/profile', payload),
 updateSettings: (payload) => httpClient.put('/admin/settings', payload),
}

export default httpClient
