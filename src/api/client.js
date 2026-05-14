import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const api = axios.create({ baseURL: BASE })

/** Call this once after Auth0 provides a token */
export function setAuthToken(token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export function clearAuthToken() {
  delete api.defaults.headers.common['Authorization']
}

// ── Auth ──────────────────────────────────────────────
export const getMe = () => api.get('/api/auth/me').then(r => r.data)

// ── Agencies ──────────────────────────────────────────
export const getAgencies = () => api.get('/api/agencies').then(r => r.data)
export const createAgency = (data) => api.post('/api/agencies', data).then(r => r.data)

// ── Branches ──────────────────────────────────────────
export const getBranches = (agencyId) =>
  api.get(`/api/agencies/${agencyId}/branches`).then(r => r.data)
export const createBranch = (agencyId, data) =>
  api.post(`/api/agencies/${agencyId}/branches`, data).then(r => r.data)

// ── Users ─────────────────────────────────────────────
export const getUsers = (agencyId) =>
  api.get(`/api/agencies/${agencyId}/users`).then(r => r.data)
export const createUser = (agencyId, data) =>
  api.post(`/api/agencies/${agencyId}/users`, data).then(r => r.data)

// ── Courses ───────────────────────────────────────────
export const getCourses = () => api.get('/api/courses').then(r => r.data)
export const createCourse = (data) => api.post('/api/courses', data).then(r => r.data)
export const getCourse = (id) => api.get(`/api/courses/${id}`).then(r => r.data)

// ── Lessons ───────────────────────────────────────────
export const getLessons = (courseId) =>
  api.get(`/api/courses/${courseId}/lessons`).then(r => r.data)
export const createLesson = (courseId, data) =>
  api.post(`/api/courses/${courseId}/lessons`, data).then(r => r.data)
