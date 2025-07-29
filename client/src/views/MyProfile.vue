<template>
  <div class="profile-page">
    <div class="profile-container">
      <div class="profile-header">
        <div class="profile-avatar">
          <div class="avatar-large">
            {{ user?.firstName?.charAt(0) }}{{ user?.lastName?.charAt(0) }}
          </div>
        </div>
        <div class="profile-info">
          <h1 class="profile-title">My Profile</h1>
          <p class="profile-subtitle">Manage your account details</p>
        </div>
      </div>

      <div class="profile-content">
        <form @submit.prevent="handleSubmit" class="profile-form">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">
                <i class="icon">👤</i>
                First Name
              </label>
              <input
                id="firstName"
                v-model="form.firstName"
                type="text"
                placeholder="John"
                :class="getFieldClass('firstName')"
                @blur="v$.firstName.$touch"
              />
              <transition name="error">
                <span v-if="v$.firstName.$error" class="error-message">
                  {{ getFieldError('firstName') }}
                </span>
              </transition>
            </div>

            <div class="form-group">
              <label for="lastName">
                <i class="icon">👤</i>
                Last Name
              </label>
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                placeholder="Doe"
                :class="getFieldClass('lastName')"
                @blur="v$.lastName.$touch"
              />
              <transition name="error">
                <span v-if="v$.lastName.$error" class="error-message">
                  {{ getFieldError('lastName') }}
                </span>
              </transition>
            </div>
          </div>

          <div class="form-group">
            <label for="email">
              <i class="icon">📧</i>
              Email Address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="john.doe@example.com"
              :class="getFieldClass('email')"
              @blur="v$.email.$touch"
              autocomplete="email"
            />
            <transition name="error">
              <span v-if="v$.email.$error" class="error-message">
                {{ getFieldError('email') }}
              </span>
            </transition>
          </div>

          <!-- Password Section -->
          <div class="password-section">
            <h3 class="section-title">Change Password (Optional)</h3>

            <div class="form-group">
              <label for="currentPassword">
                <i class="icon">🔒</i>
                Current Password
              </label>
              <div class="password-input-container">
                <input
                  id="currentPassword"
                  v-model="form.currentPassword"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  placeholder="Enter current password"
                  :class="getFieldClass('currentPassword')"
                  @blur="v$.currentPassword.$touch"
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="toggleCurrentPassword"
                >
                  {{ showCurrentPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              <transition name="error">
                <span v-if="v$.currentPassword.$error" class="error-message">
                  {{ getFieldError('currentPassword') }}
                </span>
              </transition>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="newPassword">
                  <i class="icon">🔒</i>
                  New Password
                </label>
                <div class="password-input-container">
                  <input
                    id="newPassword"
                    v-model="form.newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    placeholder="Enter new password"
                    :class="getFieldClass('newPassword')"
                    @blur="v$.newPassword.$touch"
                  />
                  <button
                    type="button"
                    class="password-toggle"
                    @click="toggleNewPassword"
                  >
                    {{ showNewPassword ? '🙈' : '👁️' }}
                  </button>
                </div>
                <transition name="error">
                  <span v-if="v$.newPassword.$error" class="error-message">
                    {{ getFieldError('newPassword') }}
                  </span>
                </transition>
              </div>

              <div class="form-group">
                <label for="confirmPassword">
                  <i class="icon">🔒</i>
                  Confirm New Password
                </label>
                <div class="password-input-container">
                  <input
                    id="confirmPassword"
                    v-model="form.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="Confirm new password"
                    :class="getFieldClass('confirmPassword')"
                    @blur="v$.confirmPassword.$touch"
                  />
                  <button
                    type="button"
                    class="password-toggle"
                    @click="toggleConfirmPassword"
                  >
                    {{ showConfirmPassword ? '🙈' : '👁️' }}
                  </button>
                </div>
                <transition name="error">
                  <span v-if="v$.confirmPassword.$error" class="error-message">
                    {{ getFieldError('confirmPassword') }}
                  </span>
                </transition>
              </div>
            </div>
          </div>

          <!-- Error message -->
          <transition name="error">
            <div v-if="submitError" class="submit-error">
              <i class="error-icon">⚠️</i>
              {{ submitError }}
            </div>
          </transition>

          <!-- Success message -->
          <transition name="error">
            <div v-if="submitSuccess" class="submit-success">
              <i class="success-icon">✅</i>
              {{ submitSuccess }}
            </div>
          </transition>

          <div class="form-actions">
            <button
              type="submit"
              :disabled="loading || !isFormValid"
              class="submit-button"
            >
              <div v-if="loading" class="loading-spinner"></div>
              <i v-else class="submit-icon">💾</i>
              <span>{{ loading ? 'Saving...' : 'Save Changes' }}</span>
            </button>

            <button
              type="button"
              @click="resetForm"
              class="reset-button"
            >
              <i class="reset-icon">🔄</i>
              <span>Reset</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import { useAuth } from '../composables/useAuth'
import { useProfileValidation } from '../composables/useValidation'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { updateProfile } = useAuth()

const loading = ref(false)
const submitError = ref('')
const submitSuccess = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const { v$, getFieldClass, getFieldError, isFormValid } = useProfileValidation(form)

// Load user data when component mounts or user data changes
const loadUserData = () => {
  if (user.value) {
    form.firstName = user.value.firstName || ''
    form.lastName = user.value.lastName || ''
    form.email = user.value.email || ''

    // Clear password fields for security
    form.currentPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
  }
}

// Watch for user data changes
watch(user, loadUserData, { immediate: true })

onMounted(async () => {
  // Ensure user data is loaded
  if (!user.value) {
    await authStore.getCurrentUser()
  }
  loadUserData()
})

const toggleCurrentPassword = () => {
  showCurrentPassword.value = !showCurrentPassword.value
}

const toggleNewPassword = () => {
  showNewPassword.value = !showNewPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const handleSubmit = async () => {
  v$.value.$touch()

  if (!isFormValid.value) {
    submitError.value = 'Please fix the validation errors'
    return
  }

  try {
    loading.value = true
    submitError.value = ''
    submitSuccess.value = ''

    const updateData = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email
    }

    // Only include password data if changing password
    if (form.currentPassword || form.newPassword) {
      updateData.currentPassword = form.currentPassword
      updateData.newPassword = form.newPassword
      updateData.confirmPassword = form.confirmPassword
    }

    const result = await updateProfile(updateData)

    if (result.success) {
      submitSuccess.value = 'Profile updated successfully!'

      // Clear password fields after successful update
      form.currentPassword = ''
      form.newPassword = ''
      form.confirmPassword = ''
      v$.value.$reset()

      setTimeout(() => {
        submitSuccess.value = ''
      }, 3000)
    } else {
      submitError.value = result.message || 'Failed to update profile'
    }
  } catch (error) {
    submitError.value = 'An error occurred while updating profile'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  loadUserData()

  // Clear password fields
  form.currentPassword = ''
  form.newPassword = ''
  form.confirmPassword = ''

  // Reset validation
  v$.value.$reset()

  submitError.value = ''
  submitSuccess.value = ''
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  padding: 2rem;
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  padding: 2rem;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(51, 51, 102, 0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.profile-avatar {
  flex-shrink: 0;
}

.avatar-large {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 2.5rem;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
}

.profile-info {
  flex: 1;
}

.profile-title {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.profile-subtitle {
  margin: 0;
  color: #e2e8f0;
  font-size: 1rem;
  opacity: 0.8;
}

.profile-content {
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2rem;
  border: 1px solid rgba(51, 51, 102, 0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.password-section {
  margin-top: 1rem;
  padding: 2rem;
  background: rgba(15, 15, 35, 0.6);
  border-radius: 16px;
  border: 1px solid rgba(51, 51, 102, 0.2);
}

.section-title {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #e2e8f0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title::before {
  content: '🔐';
  font-size: 1.1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.875rem;
}

.icon {
  font-size: 1rem;
}

/* Component-specific form overrides - base forms are now in global design system */
.form-input {
  padding: 1rem 1.25rem;
  border: 2px solid rgba(51, 51, 102, 0.4);
  border-radius: 12px;
  background: rgba(15, 15, 35, 0.8);
  font-size: 1rem;
}

.form-input:focus {
  border-color: #667eea;
  background: rgba(15, 15, 35, 0.9);
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.password-input-container .form-input {
  padding-right: 3.5rem;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 1.1rem;
  transition: color 0.2s ease;
  z-index: 1;
}

.password-toggle:hover {
  color: #667eea;
}

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.submit-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  padding: 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.submit-success {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10b981;
  padding: 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.submit-button,
.reset-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  flex: 1;
}

.submit-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.reset-button {
  background: rgba(51, 51, 102, 0.2);
  border: 1px solid rgba(51, 51, 102, 0.4);
  color: #e2e8f0;
}

.reset-button:hover {
  background: rgba(51, 51, 102, 0.3);
  transform: translateY(-2px);
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-enter-active,
.error-leave-active {
  transition: all 0.3s ease;
}

.error-enter-from,
.error-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .profile-page {
    padding: 1rem;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .password-section {
    padding: 1.5rem;
    margin-top: 1rem;
  }

  .section-title {
    font-size: 1.1rem;
  }
}
</style>
