import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import ApiService from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  // Set axios default header
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  const login = async (credentials) => {
    try {
      loading.value = true
      const response = await ApiService.login(credentials)

      // New response format: { token, user }
      token.value = response.token
      user.value = response.user

      localStorage.setItem('token', token.value)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed',
        details: error.details || []
      }
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    try {
      loading.value = true
      const response = await ApiService.register(userData)

      // New response format: { token, user }
      token.value = response.token
      user.value = response.user

      localStorage.setItem('token', token.value)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Registration failed',
        details: error.details || []
      }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      if (token.value) {
        await ApiService.logout()
      }
    } catch (error) {
      // Ignore logout errors
    } finally {
      // Clear local state regardless of server response
      user.value = null
      token.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
      // Small delay to ensure state is cleared
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  const getCurrentUser = async () => {
    if (!token.value) return

    try {
      const response = await ApiService.getCurrentUser()
      // New response format: { user }
      user.value = response.user
    } catch (error) {
      logout()
    }
  }

  const updateProfile = async (userData) => {
    try {
      loading.value = true
      const response = await ApiService.updateProfile(userData)
      // New response format: { user }
      user.value = response.user
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Update failed',
        details: error.details || []
      }
    } finally {
      loading.value = false
    }
  }

  const changePassword = async (passwordData) => {
    try {
      loading.value = true
      const response = await ApiService.changePassword(passwordData)
      // New response format: { user }
      user.value = response.user
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Password change failed',
        details: error.details || []
      }
    } finally {
      loading.value = false
    }
  }

  const initializeAuth = async () => {
    if (token.value) {
      try {
        await getCurrentUser()
      } catch (error) {
        logout()
      }
    }
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    getCurrentUser,
    updateProfile,
    changePassword,
    initializeAuth
  }
})
