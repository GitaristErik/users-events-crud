import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserProfile from '../views/UserProfile.vue'
import EventsView from '../views/EventsView.vue'
import AuthView from '../views/AuthView.vue'
import MyProfile from '../views/MyProfile.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/events',
      name: 'events',
      component: EventsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: MyProfile,
      meta: { requiresAuth: true }
    },
    {
      path: '/user/:id',
      name: 'UserProfile',
      component: UserProfile,
      meta: { requiresAuth: true }
    }
  ],
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
  } else {
    // If navigating to profile and user is authenticated, ensure user data is loaded
    if (to.name === 'profile' && authStore.isAuthenticated && !authStore.user) {
      await authStore.getCurrentUser()
    }
    next()
  }
})

export default router
