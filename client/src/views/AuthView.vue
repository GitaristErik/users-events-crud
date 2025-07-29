<template>
  <div class="auth-page">
    <!-- Animated background -->
    <div class="auth-background">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
      </div>
    </div>

    <div class="auth-container">
      <div class="auth-card">
        <!-- Header with animated logo -->
        <div class="auth-header">
          <div class="auth-logo">
            <div class="logo-icon">📅</div>
            <div class="logo-text">
              <h1 class="logo-title">EventManager</h1>
              <p class="logo-subtitle">Manage your events beautifully</p>
            </div>
          </div>

          <div class="auth-tabs">
            <button
              :class="['tab-button', { active: isLogin }]"
              @click="switchToLogin"
            >
              Login
            </button>
            <button
              :class="['tab-button', { active: !isLogin }]"
              @click="switchToRegister"
            >
              Register
            </button>
            <div class="tab-indicator" :class="{ 'tab-register': !isLogin }"></div>
          </div>
        </div>

        <!-- Form container -->
        <div class="form-container">
          <form @submit.prevent="handleSubmit" class="auth-form">
            <!-- Registration fields -->
            <transition name="slide-down">
              <div v-if="!isLogin" class="name-fields">
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
                    :class="['form-input', {
                      'error': isFieldInvalid('firstName'),
                      'success': isFieldValid('firstName')
                    }]"
                    @blur="validateField('firstName')"
                    @input="clearError"
                  />
                  <transition name="error">
                    <span v-if="isFieldInvalid('firstName')" class="error-message">
                      {{ getErrorMessage('firstName') }}
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
                    :class="['form-input', {
                      'error': isFieldInvalid('lastName'),
                      'success': isFieldValid('lastName')
                    }]"
                    @blur="validateField('lastName')"
                    @input="clearError"
                  />
                  <transition name="error">
                    <span v-if="isFieldInvalid('lastName')" class="error-message">
                      {{ getErrorMessage('lastName') }}
                    </span>
                  </transition>
                </div>
              </div>
            </transition>

            <!-- Email field -->
            <div class="form-group">
              <label for="email">
                <i class="icon">📧</i>
                Email Address
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="john@example.com"
                :class="['form-input', {
                  'error': isFieldInvalid('email'),
                  'success': isFieldValid('email')
                }]"
                @blur="validateField('email')"
                @input="clearError"
                autocomplete="email"
              />
              <transition name="error">
                <span v-if="isFieldInvalid('email')" class="error-message">
                  {{ getErrorMessage('email') }}
                </span>
              </transition>
            </div>

            <!-- Password field -->
            <div class="form-group">
              <label for="password">
                <i class="icon">🔒</i>
                Password
              </label>
              <div class="password-input-container">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  :class="['form-input', {
                    'error': isFieldInvalid('password'),
                    'success': isFieldValid('password')
                  }]"
                  @blur="validateField('password')"
                  @input="clearError"
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="togglePassword"
                >
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              <transition name="error">
                <span v-if="isFieldInvalid('password')" class="error-message">
                  {{ getErrorMessage('password') }}
                </span>
              </transition>              <!-- Password strength indicator -->
              <div v-if="!isLogin && form.password" class="password-strength">
                <div class="strength-bar">
                  <div
                    class="strength-fill"
                    :class="`strength-${passwordStrength.level}`"
                    :style="{ width: passwordStrength.percentage + '%' }"
                  ></div>
                </div>
                <span class="strength-text">{{ passwordStrength.text }}</span>
              </div>
            </div>

            <!-- Confirm Password field (register only) -->
            <transition name="slide-down">
              <div v-if="!isLogin" class="form-group">
                <label for="confirmPassword">
                  <i class="icon">🔒</i>
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Confirm your password"
                  :class="getFieldClass('confirmPassword')"
                  @blur="v$.confirmPassword.$touch"
                  autocomplete="new-password"
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="toggleConfirmPassword"
                >
                  {{ showConfirmPassword ? '🙈' : '👁️' }}
                </button>
                <transition name="error">
                  <span v-if="v$.confirmPassword.$error" class="error-message">
                    {{ getFieldError('confirmPassword') }}
                  </span>
                </transition>
              </div>
            </transition>

            <!-- Error message -->
            <transition name="error">
              <div v-if="submitError" class="submit-error">
                <i class="error-icon">⚠️</i>
                {{ submitError }}
              </div>
            </transition>

            <!-- Submit button -->
            <button
              type="submit"
              :disabled="loading || !isFormValid"
              class="submit-button"
            >
              <div v-if="loading" class="loading-spinner"></div>
              <i v-else class="submit-icon">{{ isLogin ? '🚪' : '🎯' }}</i>
              <span>{{ loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account') }}</span>
            </button>
          </form>

          <!-- Additional options -->
          <div class="auth-footer">
            <div class="divider">
              <span>or</span>
            </div>

            <p class="switch-mode">
              {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
              <button @click="toggleMode" class="switch-button">
                {{ isLogin ? 'Create one now' : 'Sign in instead' }}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useAuthValidation } from '../composables/useValidation'

const { login, register, loading } = useAuth()

const isLogin = ref(true)
const submitError = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const { v$, getErrorMessage, isFieldValid, isFieldInvalid } = useAuthValidation(form, isLogin)

// Password strength calculator
const passwordStrength = computed(() => {
  const password = form.password
  if (!password) return { level: 'weak', percentage: 0, text: '' }

  let score = 0
  if (password.length >= 4) score += 30
  if (password.length >= 6) score += 20
  if (password.length >= 8) score += 20
  if (/\d/.test(password)) score += 15
  if (/[a-zA-Z]/.test(password)) score += 15

  let level = 'weak'
  let text = 'Weak password'

  if (score >= 80) {
    level = 'strong'
    text = 'Strong password'
  } else if (score >= 60) {
    level = 'good'
    text = 'Good password'
  } else if (score >= 40) {
    level = 'fair'
    text = 'Fair password'
  }

  return { level, percentage: Math.min(score, 100), text }
})

// Form validation
const isFormValid = computed(() => {
  return !v$.value.$invalid
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const switchToLogin = () => {
  if (!isLogin.value) {
    isLogin.value = true
    resetForm()
  }
}

const switchToRegister = () => {
  if (isLogin.value) {
    isLogin.value = false
    resetForm()
  }
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
  resetForm()
}

const resetForm = () => {
  submitError.value = ''
  Object.keys(form).forEach(key => {
    form[key] = ''
  })
  v$.value.$reset()
}

const validateField = async (field) => {
  const fieldValidation = v$.value[field]
  if (fieldValidation) {
    fieldValidation.$touch()
  }
}

const clearError = () => {
  submitError.value = ''
}

const handleSubmit = async () => {
  submitError.value = ''

  v$.value.$touch()
  if (v$.value.$invalid) {
    submitError.value = 'Please fix the errors above'
    return
  }

  try {
    let result
    if (isLogin.value) {
      result = await login({
        email: form.email,
        password: form.password
      })
    } else {
      result = await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password
      })
    }

    if (!result.success) {
      submitError.value = result.message
    }
  } catch (err) {
    submitError.value = 'An unexpected error occurred'
  }
}
</script><style scoped>
.auth-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  overflow: hidden;
}

/* Animated background */
.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.floating-shapes {
  position: relative;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 20%;
  right: 15%;
  animation-delay: 2s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  bottom: 30%;
  left: 20%;
  animation-delay: 4s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  bottom: 10%;
  right: 20%;
  animation-delay: 1s;
}

.shape-5 {
  width: 40px;
  height: 40px;
  top: 50%;
  left: 50%;
  animation-delay: 3s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.6;
  }
}

/* Auth container */
.auth-container {
  position: relative;
  z-index: 10;
  padding: 2rem;
  width: 100%;
  max-width: 480px;
}

.auth-card {
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 0;
  border: 1px solid rgba(51, 51, 102, 0.3);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 80px rgba(102, 126, 234, 0.1);
  overflow: hidden;
  animation: slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Header */
.auth-header {
  padding: 2rem 2rem 1rem;
  text-align: center;
  border-bottom: 1px solid rgba(51, 51, 102, 0.2);
}

.auth-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.logo-icon {
  font-size: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

.logo-text {
  text-align: center;
}

.logo-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-subtitle {
  margin: 0.25rem 0 0;
  color: #e2e8f0;
  font-size: 0.875rem;
  opacity: 0.8;
}

/* Tabs */
.auth-tabs {
  position: relative;
  display: flex;
  background: rgba(15, 15, 35, 0.8);
  border-radius: 12px;
  padding: 4px;
}

.tab-button {
  flex: 1;
  background: none;
  border: none;
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.tab-button.active {
  color: #ffffff;
}

.tab-indicator {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.tab-indicator.tab-register {
  transform: translateX(100%);
}

/* Form container */
.form-container {
  padding: 2rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.name-fields {
  overflow: hidden;
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

.password-strength {
  margin-top: 0.5rem;
}

.strength-bar {
  height: 4px;
  background: rgba(51, 51, 102, 0.3);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.strength-weak {
  background: #ef4444;
}

.strength-fair {
  background: #f59e0b;
}

.strength-good {
  background: #3b82f6;
}

.strength-strong {
  background: #10b981;
}

.strength-text {
  font-size: 0.75rem;
  color: #e2e8f0;
  opacity: 0.8;
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

.error-icon {
  font-size: 1.1rem;
}

.submit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-top: 0.5rem;
}

.submit-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.submit-button:hover::before {
  left: 100%;
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

.submit-icon {
  font-size: 1.1rem;
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Footer */
.auth-footer {
  margin-top: 2rem;
}

.divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(51, 51, 102, 0.3);
}

.divider span {
  background: rgba(26, 26, 46, 0.95);
  color: #9ca3af;
  padding: 0 1rem;
  font-size: 0.875rem;
  position: relative;
}

.switch-mode {
  text-align: center;
  color: #e2e8f0;
  margin: 0;
}

.switch-button {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;
  margin-left: 0.5rem;
  transition: color 0.2s ease;
}

.switch-button:hover {
  color: #764ba2;
}

/* Animations */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
  max-height: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 200px;
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

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  }
  50% {
    box-shadow: 0 8px 40px rgba(102, 126, 234, 0.5);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .auth-container {
    padding: 1rem;
  }

  .auth-card {
    border-radius: 20px;
  }

  .auth-header {
    padding: 1.5rem 1.5rem 1rem;
  }

  .form-container {
    padding: 1.5rem;
  }

  .logo-icon {
    width: 60px;
    height: 60px;
    font-size: 2rem;
  }

  .logo-title {
    font-size: 1.5rem;
  }

  .shape {
    opacity: 0.3;
  }
}

@media (max-width: 480px) {
  .auth-header {
    padding: 1rem;
  }

  .form-container {
    padding: 1rem;
  }

  .tab-button {
    font-size: 0.8rem;
    padding: 0.6rem 0.8rem;
  }
}
</style>
