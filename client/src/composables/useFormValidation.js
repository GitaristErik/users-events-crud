import { reactive, computed } from 'vue'

export function useFormValidation() {
  const formState = reactive({
    isSubmitting: false,
    hasSubmitted: false
  })

  // Generic validation rules
  const validationRules = {
    required: (value, fieldName = 'Field') => {
      if (!value || (typeof value === 'string' && !value.trim())) {
        return `${fieldName} is required`
      }
      return null
    },

    email: (value) => {
      if (!value) return null
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value) ? null : 'Please enter a valid email address'
    },

    minLength: (value, min, fieldName = 'Field') => {
      if (!value) return null
      return value.length >= min ? null : `${fieldName} must be at least ${min} characters`
    },

    maxLength: (value, max, fieldName = 'Field') => {
      if (!value) return null
      return value.length <= max ? null : `${fieldName} cannot exceed ${max} characters`
    },

    phone: (value) => {
      if (!value) return null
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
      return phoneRegex.test(value.replace(/\s/g, '')) ? null : 'Please enter a valid phone number'
    },

    password: (value) => {
      if (!value) return null
      if (value.length < 6) return 'Password must be at least 6 characters'
      if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter'
      if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter'
      if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number'
      return null
    },

    passwordMatch: (value, originalPassword) => {
      if (!value) return null
      return value === originalPassword ? null : 'Passwords do not match'
    },

    date: (value) => {
      if (!value) return null
      const date = new Date(value)
      return !isNaN(date.getTime()) ? null : 'Please enter a valid date'
    },

    futureDate: (value) => {
      if (!value) return null
      const date = new Date(value)
      const now = new Date()
      return date > now ? null : 'Date must be in the future'
    },

    dateRange: (startDate, endDate) => {
      if (!startDate || !endDate) return null
      const start = new Date(startDate)
      const end = new Date(endDate)
      return end > start ? null : 'End date must be after start date'
    }
  }

  // Event-specific validation
  const validateEvent = (eventData) => {
    const errors = {}

    // Title validation
    const titleError = validationRules.required(eventData.title, 'Title') ||
                      validationRules.minLength(eventData.title, 3, 'Title') ||
                      validationRules.maxLength(eventData.title, 100, 'Title')
    if (titleError) errors.title = titleError

    // Description validation
    const descError = validationRules.maxLength(eventData.description, 500, 'Description')
    if (descError) errors.description = descError

    // User ID validation
    const userIdError = validationRules.required(eventData.userId, 'User')
    if (userIdError) errors.userId = userIdError

    // Start date validation
    const startDateError = validationRules.required(eventData.startDate, 'Start date') ||
                           validationRules.date(eventData.startDate) ||
                           validationRules.futureDate(eventData.startDate)
    if (startDateError) errors.startDate = startDateError

    // End date validation
    const endDateError = validationRules.required(eventData.endDate, 'End date') ||
                         validationRules.date(eventData.endDate)
    if (endDateError) errors.endDate = endDateError

    // Date range validation
    if (!startDateError && !endDateError) {
      const rangeError = validationRules.dateRange(eventData.startDate, eventData.endDate)
      if (rangeError) errors.endDate = rangeError
    }

    return errors
  }

  // User-specific validation
  const validateUser = (userData) => {
    const errors = {}

    // First name validation
    const firstNameError = validationRules.required(userData.firstName, 'First name') ||
                          validationRules.minLength(userData.firstName, 2, 'First name') ||
                          validationRules.maxLength(userData.firstName, 50, 'First name')
    if (firstNameError) errors.firstName = firstNameError

    // Last name validation
    const lastNameError = validationRules.required(userData.lastName, 'Last name') ||
                         validationRules.minLength(userData.lastName, 2, 'Last name') ||
                         validationRules.maxLength(userData.lastName, 50, 'Last name')
    if (lastNameError) errors.lastName = lastNameError

    // Email validation
    const emailError = validationRules.required(userData.email, 'Email') ||
                      validationRules.email(userData.email)
    if (emailError) errors.email = emailError

    // Phone validation
    const phoneError = validationRules.required(userData.phoneNumber, 'Phone number') ||
                      validationRules.phone(userData.phoneNumber)
    if (phoneError) errors.phoneNumber = phoneError

    return errors
  }

  // Auth-specific validation
  const validateAuth = (authData, isRegistration = false) => {
    const errors = {}

    if (isRegistration) {
      // Registration validation includes user fields
      Object.assign(errors, validateUser(authData))
    } else {
      // Login validation
      const emailError = validationRules.required(authData.email, 'Email') ||
                        validationRules.email(authData.email)
      if (emailError) errors.email = emailError
    }

    // Password validation
    const passwordError = validationRules.required(authData.password, 'Password') ||
                         (isRegistration ? validationRules.password(authData.password) : null)
    if (passwordError) errors.password = passwordError

    return errors
  }

  const validatePasswordChange = (passwordData) => {
    const errors = {}

    // Current password
    const currentPasswordError = validationRules.required(passwordData.currentPassword, 'Current password')
    if (currentPasswordError) errors.currentPassword = currentPasswordError

    // New password
    const newPasswordError = validationRules.required(passwordData.newPassword, 'New password') ||
                            validationRules.password(passwordData.newPassword)
    if (newPasswordError) errors.newPassword = newPasswordError

    return errors
  }

  const isFormValid = (errors) => {
    return Object.keys(errors).length === 0
  }

  return {
    formState,
    validationRules,
    validateEvent,
    validateUser,
    validateAuth,
    validatePasswordChange,
    isFormValid
  }
}
