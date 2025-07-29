import { ref } from 'vue'
import ApiService from '@/services/api'

export function useApi() {
  const loading = ref(false)
  const error = ref(null)

  const handleApiCall = async (apiCall, showError = true) => {
    loading.value = true
    error.value = null

    try {
      const result = await apiCall()
      return result
    } catch (err) {
      if (showError) {
        error.value = err.message || 'An error occurred'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  // Events
  const fetchEvents = (userId = null) => {
    return handleApiCall(() => ApiService.getEvents(userId))
  }

  const createEvent = (eventData) => {
    return handleApiCall(() => ApiService.createEvent(eventData))
  }

  const updateEvent = (eventId, eventData) => {
    return handleApiCall(() => ApiService.updateEvent(eventId, eventData))
  }

  const deleteEvent = (eventId) => {
    return handleApiCall(() => ApiService.deleteEvent(eventId))
  }

  const getEventById = (eventId) => {
    return handleApiCall(() => ApiService.getEventById(eventId))
  }

  // Users
  const fetchUsers = () => {
    return handleApiCall(() => ApiService.getUsers())
  }

  const createUser = (userData) => {
    return handleApiCall(() => ApiService.createUser(userData))
  }

  const updateUser = (userId, userData) => {
    return handleApiCall(() => ApiService.updateUser(userId, userData))
  }

  const deleteUser = (userId) => {
    return handleApiCall(() => ApiService.deleteUser(userId))
  }

  const getUserById = (userId) => {
    return handleApiCall(() => ApiService.getUserById(userId))
  }

  // Auth
  const getCurrentUser = () => {
    return handleApiCall(() => ApiService.getCurrentUser(), false)
  }

  const updateProfile = (userData) => {
    return handleApiCall(() => ApiService.updateProfile(userData))
  }

  const changePassword = (passwordData) => {
    return handleApiCall(() => ApiService.changePassword(passwordData))
  }

  return {
    loading,
    error,
    // Events
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    // Users
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    // Auth
    getCurrentUser,
    updateProfile,
    changePassword,
    // Generic
    handleApiCall
  }
}
