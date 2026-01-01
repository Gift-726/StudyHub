import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 if we're not already on login/signup pages
    if (error.response?.status === 401 && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
}

// Dashboard API
export const dashboardAPI = {
  getDashboard: () => api.get('/dashboard'),
}

// Courses API
export const coursesAPI = {
  getMyCourses: () => api.get('/courses/my-courses'),
  getAllCourses: () => api.get('/courses'),
  getCourseDetails: (courseId) => api.get(`/courses/${courseId}`),
  enrollCourse: (courseId) => api.post(`/courses/${courseId}/enroll`),
}

// Progress API
export const progressAPI = {
  markVideoComplete: (courseId, topicId, videoId, watchTime) => 
    api.post('/progress/complete', { courseId, topicId, videoId, watchTime }),
  updateWatchTime: (courseId, topicId, videoId, watchTime) => 
    api.post('/progress/watch-time', { courseId, topicId, videoId, watchTime }),
  trackVideoWatch: (courseId, topicId, videoId) => 
    api.post('/progress/track', { courseId, topicId, videoId }),
  getCourseProgress: (courseId) => 
    api.get(`/progress/course/${courseId}`),
}

// Admin API
export const adminAPI = {
  importPlaylist: (data) => api.post('/admin/import-playlist', data),
  uploadMaterial: (formData) => api.post('/admin/upload-material', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAllCourses: () => api.get('/admin/courses'),
  getCourseDetails: (courseId) => api.get(`/admin/courses/${courseId}`),
  deleteTopic: (topicId) => api.delete(`/admin/topics/${topicId}`),
  createCourse: (data) => api.post('/admin/courses', data),
}

export default api

