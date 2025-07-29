import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()

  const { user, token, loading, isAuthenticated } = storeToRefs(authStore)

  const login = async (credentials) => {
    const result = await authStore.login(credentials)
    if (result.success) {
      router.push('/')
    }
    return result
  }

  const register = async (userData) => {
    const result = await authStore.register(userData)
    if (result.success) {
      router.push('/')
    }
    return result
  }

  const logout = async () => {
    await authStore.logout()
    // Force navigation to auth page using replace to prevent back button issues
    await router.replace('/auth')
    // Additional fallback if router fails
    if (router.currentRoute.value.path !== '/auth') {
      window.location.replace('/auth')
    }
  }

  const updateProfile = async (userData) => {
    return await authStore.updateUser(userData)
  }

  const initAuth = async () => {
    if (token.value && !user.value) {
      await authStore.getCurrentUser()
    }
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,

    login,
    register,
    logout,
    updateProfile,
    initAuth
  }
}
