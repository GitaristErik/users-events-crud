import axios from 'axios'
import CONFIG from '@/config/api'

// Setup axios interceptors
axios.interceptors.request.use(
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

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect if it's a logout request
      if (!error.config?.url?.includes('/auth/logout')) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/auth'
      }
    }
    return Promise.reject(error)
  }
)

// Universal API service to handle new standardized response format
class ApiService {
  // Helper method to handle API responses
  static handleResponse(response) {
    // New server response format: { success: true, message: string, data: any }
    if (response.data.success) {
      return response.data.data || response.data
    }
    throw new Error(response.data.message || 'Unknown error')
  }

  // Helper method to handle API errors
  static handleError(error) {
    if (error.response?.data) {
      const errorData = error.response.data
      // New error format: { success: false, message: string, errors?: array }
      const message = errorData.message || 'Unknown error'
      const details = errorData.errors || []

      const apiError = new Error(message)
      apiError.details = details
      apiError.status = error.response.status
      throw apiError
    }
    throw error
  }

  // Users API
  static async getUsers() {
    try {
      const response = await axios.get(CONFIG.getEndpoint('USERS'))
      return this.handleResponse(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async createUser(userData) {
    try {
      const response = await axios.post(CONFIG.getEndpoint('USERS'), userData)
      return this.handleResponse(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async getUserById(userId) {
    try {
      const response = await axios.get(`${CONFIG.getEndpoint('USERS')}/${userId}`)
      return this.handleResponse(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async updateUser(userId, userData) {
    try {
      const response = await axios.put(`${CONFIG.getEndpoint('USERS')}/${userId}`, userData)
      return this.handleResponse(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async deleteUser(userId) {
    try {
      const response = await axios.delete(`${CONFIG.getEndpoint('USERS')}/${userId}`)
      return this.handleResponse(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  // Events API
  static async getEvents(userId = null) {
    try {
      const url = userId
        ? `${CONFIG.getEndpoint('EVENTS')}?userId=${userId}`
        : CONFIG.getEndpoint('EVENTS')
      const response = await axios.get(url)
      return this.handleResponse(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async createEvent(eventData) {
    try {
      const response = await axios.post(CONFIG.getEndpoint('EVENTS'), eventData)
      return this.handleResponse(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async getEventById(eventId) {
    try {
      const response = await axios.get(`${CONFIG.getEndpoint('EVENTS')}/${eventId}`)
      return this.handleResponse(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async updateEvent(eventId, eventData) {
    try {
      const response = await axios.put(`${CONFIG.getEndpoint('EVENTS')}/${eventId}`, eventData)
      return this.handleResponse(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async deleteEvent(eventId) {
    try {
      const response = await axios.delete(`${CONFIG.getEndpoint('EVENTS')}/${eventId}`)
      return this.handleResponse(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  // Auth API
  static async login(credentials) {
    try {
      const response = await axios.post(CONFIG.getEndpoint('AUTH_LOGIN'), credentials)
      return this.handleResponse(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async register(userData) {
    try {
      const response = await axios.post(CONFIG.getEndpoint('AUTH_REGISTER'), userData)
      return this.handleResponse(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async getCurrentUser() {
    try {
      const response = await axios.get(CONFIG.getEndpoint('AUTH_ME'))
      return this.handleResponse(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async updateProfile(userData) {
    try {
      const response = await axios.put(CONFIG.getEndpoint('AUTH_PROFILE'), userData)
      return this.handleResponse(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async changePassword(passwordData) {
    try {
      const response = await axios.put(CONFIG.getEndpoint('AUTH_CHANGE_PASSWORD'), passwordData)
      return this.handleResponse(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async logout() {
    try {
      const response = await axios.post(`${CONFIG.API_URL}/auth/logout`)
      return this.handleResponse(response)
    } catch (error) {
      this.handleError(error)
    }
  }
}

export default ApiService
