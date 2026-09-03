import axios from 'axios'

const AUTH_STORAGE_KEY = 'praksha_auth'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1'

const httpClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

function readStoredAuth() {
  try {
    const remembered = localStorage.getItem(AUTH_STORAGE_KEY)
    if (remembered) return JSON.parse(remembered)
    const session = sessionStorage.getItem(AUTH_STORAGE_KEY)
    if (session) return JSON.parse(session)
    return null
  } catch {
    return null
  }
}

httpClient.interceptors.request.use((config) => {
  const auth = readStoredAuth()
  if (auth?.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      sessionStorage.removeItem(AUTH_STORAGE_KEY)
    }
    return Promise.reject(error)
  }
)

export { AUTH_STORAGE_KEY }
export default httpClient
