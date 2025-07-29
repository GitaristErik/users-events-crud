<template>
  <nav
    v-if="isAuthenticated"
    :class="['app-bar', { 'app-bar--hidden': isHidden, 'app-bar--scrolled': isScrolled }]"
  >
    <div class="app-bar__container">
      <div class="app-bar__brand">
        <router-link to="/" class="brand-link">
          <div class="brand-icon">📅</div>
          <div class="brand-text">
            <span class="brand-title">EventManager</span>
            <span class="brand-subtitle">Manage your events</span>
          </div>
        </router-link>
      </div>

      <div v-if="isAuthenticated" class="app-bar__navigation">
        <router-link to="/" class="nav-item">
          <div class="nav-icon">👥</div>
          <span>Users</span>
        </router-link>
        <router-link to="/events" class="nav-item">
          <div class="nav-icon">📅</div>
          <span>Events</span>
        </router-link>
        <router-link to="/profile" class="nav-item">
          <div class="nav-icon">⚙️</div>
          <span>Profile</span>
        </router-link>
      </div>

      <div class="app-bar__actions">
        <div v-if="isAuthenticated" class="user-section">
          <div class="user-info">
            <div class="user-avatar">
              <div class="avatar-circle">
                {{ user?.firstName?.charAt(0) }}{{ user?.lastName?.charAt(0) }}
              </div>
            </div>
            <div class="user-details">
              <span class="user-name">{{ user?.firstName }} {{ user?.lastName }}</span>
              <span class="user-subtitle">Current User</span>
            </div>
          </div>
          <button @click="handleLogout" class="logout-button">
            <div class="button-icon">🚪</div>
            <span>Logout</span>
          </button>
        </div>

        <router-link v-else to="/auth" class="login-button">
          <div class="button-icon">🔐</div>
          <span>Login</span>
        </router-link>
      </div>

      <!-- Mobile menu button -->
      <button
        v-if="isAuthenticated"
        @click="toggleMobileMenu"
        class="mobile-menu-button"
      >
        <div :class="['hamburger', { active: isMobileMenuOpen }]">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
    </div>

    <!-- Mobile menu -->
    <div v-if="isAuthenticated" :class="['mobile-menu', { active: isMobileMenuOpen }]">
      <router-link to="/" class="mobile-nav-item" @click="closeMobileMenu">
        <div class="nav-icon">👥</div>
        <span>Users</span>
      </router-link>
      <router-link to="/events" class="mobile-nav-item" @click="closeMobileMenu">
        <div class="nav-icon">📅</div>
        <span>Events</span>
      </router-link>
      <router-link to="/profile" class="mobile-nav-item" @click="closeMobileMenu">
        <div class="nav-icon">⚙️</div>
        <span>Profile</span>
      </router-link>
      <div class="mobile-user-section">
        <div class="mobile-user-info">
          <div class="avatar-circle">
            {{ user?.firstName?.charAt(0) }}{{ user?.lastName?.charAt(0) }}
          </div>
          <div>
            <div class="user-name">{{ user?.firstName }} {{ user?.lastName }}</div>
            <div class="user-subtitle">Current User</div>
          </div>
        </div>
        <button @click="handleLogout" class="mobile-logout-button">
          <div class="button-icon">🚪</div>
          <span>Logout</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import { useAuth } from '../composables/useAuth'

const { logout } = useAuth()
const authStore = useAuthStore()

const { user, isAuthenticated } = storeToRefs(authStore)

const isHidden = ref(false)
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const lastScrollY = ref(0)

const handleScroll = () => {
  const currentScrollY = window.scrollY

  // Add scrolled class when scrolled down
  isScrolled.value = currentScrollY > 20

  // Hide/show app bar based on scroll direction
  if (currentScrollY > lastScrollY.value && currentScrollY > 100) {
    isHidden.value = true
    isMobileMenuOpen.value = false
  } else {
    isHidden.value = false
  }

  lastScrollY.value = currentScrollY
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleLogout = async () => {
  isMobileMenuOpen.value = false
  await logout()
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.app-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(15, 15, 35, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(51, 51, 102, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
}

.app-bar--hidden {
  transform: translateY(-100%);
}

.app-bar--scrolled {
  background: rgba(26, 26, 46, 0.95);
  border-bottom: 1px solid rgba(51, 51, 102, 0.5);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.app-bar__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.app-bar__brand {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: #ffffff;
  transition: all 0.3s ease;
}

.brand-link:hover {
  transform: scale(1.02);
}

.brand-icon {
  font-size: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-subtitle {
  font-size: 0.75rem;
  color: #e2e8f0;
  opacity: 0.7;
  font-weight: 500;
}

.app-bar__navigation {
  display: flex;
  gap: 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  text-decoration: none;
  color: #e2e8f0;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s;
}

.nav-item:hover::before {
  left: 100%;
}

.nav-item:hover {
  background: rgba(102, 126, 234, 0.15);
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
}

.nav-item.router-link-active {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.nav-icon {
  font-size: 1.1rem;
}

.app-bar__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  display: flex;
  align-items: center;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  color: #ffffff;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.2;
}

.user-subtitle {
  color: #e2e8f0;
  font-size: 0.75rem;
  opacity: 0.7;
  font-weight: 400;
}

.logout-button,
.login-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.logout-button {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.logout-button:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
}

.login-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: 1px solid transparent;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.button-icon {
  font-size: 1rem;
}

.mobile-menu-button {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.hamburger {
  width: 24px;
  height: 18px;
  position: relative;
  transform: rotate(0deg);
  transition: 0.3s ease-in-out;
}

.hamburger span {
  display: block;
  position: absolute;
  height: 2px;
  width: 100%;
  background: #e2e8f0;
  border-radius: 1px;
  opacity: 1;
  left: 0;
  transform: rotate(0deg);
  transition: 0.25s ease-in-out;
}

.hamburger span:nth-child(1) {
  top: 0px;
}

.hamburger span:nth-child(2) {
  top: 8px;
}

.hamburger span:nth-child(3) {
  top: 16px;
}

.hamburger.active span:nth-child(1) {
  top: 8px;
  transform: rotate(135deg);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
  left: -60px;
}

.hamburger.active span:nth-child(3) {
  top: 8px;
  transform: rotate(-135deg);
}

.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(26, 26, 46, 0.98);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(51, 51, 102, 0.3);
  padding: 1rem 2rem 2rem;
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-menu.active {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 12px;
  text-decoration: none;
  color: #e2e8f0;
  font-weight: 600;
  transition: all 0.3s ease;
}

.mobile-nav-item:hover,
.mobile-nav-item.router-link-active {
  background: rgba(102, 126, 234, 0.15);
  color: #667eea;
}

.mobile-user-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(51, 51, 102, 0.3);
}

.mobile-user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.mobile-logout-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  color: #ef4444;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  justify-content: center;
}

.mobile-logout-button:hover {
  background: rgba(239, 68, 68, 0.2);
}

@media (max-width: 768px) {
  .app-bar__container {
    padding: 0 1rem;
  }

  .brand-subtitle {
    display: none;
  }

  .app-bar__navigation {
    display: none;
  }

  .user-section {
    display: none;
  }

  .mobile-menu-button {
    display: block;
  }
}

@media (max-width: 480px) {
  .brand-icon {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }

  .brand-title {
    font-size: 1.25rem;
  }

  .app-bar__container {
    height: 60px;
  }
}
</style>
