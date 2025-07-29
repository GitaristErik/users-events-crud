import { reactive, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, sameAs } from '@vuelidate/validators'

// Custom validators
const nameValidator = (value) => {
  if (!value) return true // Let required handle empty values
  return /^[a-zA-Z\s]+$/.test(value)
}

const passwordStrength = (value) => {
  if (!value) return true
  return value.length >= 4
}

export function useProfileValidation(form) {
  const rules = computed(() => ({
    firstName: {
      required,
      minLength: minLength(2),
      nameValidator
    },
    lastName: {
      minLength: minLength(2),
      nameValidator
    },
    email: {
      required,
      email
    },
    currentPassword: form.newPassword ? { required } : {},
    newPassword: form.currentPassword ? { required, passwordStrength } : {},
    confirmPassword: form.newPassword ? {
      required,
      sameAs: sameAs(form.newPassword)
    } : {}
  }))

  const v$ = useVuelidate(rules, form)

  const getErrorMessage = (field) => {
    const fieldValidation = v$.value[field]
    if (!fieldValidation || !fieldValidation.$error) return ''

    if (fieldValidation.required && !fieldValidation.required.$response) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
    }
    if (fieldValidation.email && !fieldValidation.email.$response) {
      return 'Please enter a valid email address'
    }
    if (fieldValidation.minLength && !fieldValidation.minLength.$response) {
      return `Must be at least ${fieldValidation.minLength.$params.min} characters`
    }
    if (fieldValidation.nameValidator && !fieldValidation.nameValidator.$response) {
      return 'Only letters and spaces are allowed'
    }
    if (fieldValidation.passwordStrength && !fieldValidation.passwordStrength.$response) {
      return 'Password must be at least 4 characters'
    }
    if (fieldValidation.sameAs && !fieldValidation.sameAs.$response) {
      return 'Passwords do not match'
    }

    return 'Invalid value'
  }

  const isFieldValid = (field) => {
    const fieldValidation = v$.value[field]
    return fieldValidation && !fieldValidation.$error && fieldValidation.$dirty
  }

  const isFieldInvalid = (field) => {
    const fieldValidation = v$.value[field]
    return fieldValidation && fieldValidation.$error && fieldValidation.$dirty
  }

  const getFieldClass = (field) => {
    const fieldValidation = v$.value[field]
    const baseClass = 'form-input'

    if (!fieldValidation || !fieldValidation.$dirty) {
      return baseClass
    }

    if (fieldValidation.$error) {
      return `${baseClass} error`
    }

    return `${baseClass} success`
  }

  const getFieldError = (field) => getErrorMessage(field)

  const isFormValid = computed(() => {
    return !v$.value.$invalid
  })

  return {
    v$,
    getErrorMessage,
    getFieldClass,
    getFieldError,
    isFieldValid,
    isFieldInvalid,
    isFormValid
  }
}



// --- Shared helpers ---
function getErrorMessageFactory(v$, extra = {}) {
  return (field) => {
    const fieldValidation = v$.value[field]
    if (!fieldValidation || !fieldValidation.$error) return ''
    if (fieldValidation.required && !fieldValidation.required.$response) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
    }
    if (fieldValidation.email && !fieldValidation.email.$response) {
      return 'Please enter a valid email address'
    }
    if (fieldValidation.minLength && !fieldValidation.minLength.$response) {
      return `Must be at least ${fieldValidation.minLength.$params.min} characters`
    }
    if (fieldValidation.sameAs && !fieldValidation.sameAs.$response) {
      return 'Passwords do not match'
    }
    if (extra.nameValidator && fieldValidation.nameValidator && !fieldValidation.nameValidator.$response) {
      return 'Only letters and spaces are allowed'
    }
    if (extra.passwordStrength && fieldValidation.passwordStrength && !fieldValidation.passwordStrength.$response) {
      return 'Password must be at least 4 characters'
    }
    return 'Invalid value'
  }
}

function isFieldValidFactory(v$) {
  return (field) => {
    const fieldValidation = v$.value[field]
    return fieldValidation && !fieldValidation.$error && fieldValidation.$dirty
  }
}

function isFieldInvalidFactory(v$) {
  return (field) => {
    const fieldValidation = v$.value[field]
    return fieldValidation && fieldValidation.$error && fieldValidation.$dirty
  }
}

function getFieldClassFactory(v$) {
  return (field) => {
    const fieldValidation = v$.value[field]
    const baseClass = 'form-input'
    if (!fieldValidation || !fieldValidation.$dirty) {
      return baseClass
    }
    if (fieldValidation.$error) {
      return `${baseClass} error`
    }
    return `${baseClass} success`
  }
}

function getFieldErrorFactory(getErrorMessage) {
  return (field) => getErrorMessage(field)
}

function isFormValidFactory(v$) {
  return computed(() => !v$.value.$invalid)
}

// --- Validation for User (auth) ---
export function useAuthValidation(form, isLogin) {
  const rules = computed(() => {
    if (isLogin.value) {
      return {
        email: { required, email },
        password: { required }
      }
    }
    return {
      firstName: { required, minLength: minLength(2) },
      lastName: { minLength: minLength(2) },
      email: { required, email },
      password: { required, minLength: minLength(3) },
      confirmPassword: { required, sameAs: sameAs(form.password) }
    }
  })
  const v$ = useVuelidate(rules, form)
  const getErrorMessage = getErrorMessageFactory(v$)
  const isFieldValid = isFieldValidFactory(v$)
  const isFieldInvalid = isFieldInvalidFactory(v$)
  const getFieldClass = getFieldClassFactory(v$)
  const getFieldError = getFieldErrorFactory(getErrorMessage)
  const isFormValid = isFormValidFactory(v$)
  return {
    v$,
    getErrorMessage,
    getFieldClass,
    getFieldError,
    isFieldValid,
    isFieldInvalid,
    isFormValid
  }
}

// --- Validation for SimpleUser (no password, no confirmPassword, no role, no isActive) ---
export function useSimpleUserValidation(form) {
  const rules = computed(() => ({
    firstName: { required, minLength: minLength(2) },
    lastName: { minLength: minLength(2) },
    email: { required, email },
    phoneNumber: {}
  }))
  const v$ = useVuelidate(rules, form)
  const getErrorMessage = getErrorMessageFactory(v$)
  const isFieldValid = isFieldValidFactory(v$)
  const isFieldInvalid = isFieldInvalidFactory(v$)
  const getFieldClass = getFieldClassFactory(v$)
  const getFieldError = getFieldErrorFactory(getErrorMessage)
  const isFormValid = isFormValidFactory(v$)
  return {
    v$,
    getErrorMessage,
    getFieldClass,
    getFieldError,
    isFieldValid,
    isFieldInvalid,
    isFormValid
  }
}

// --- Validation for Events ---
export function useEventValidation(form) {
  const rules = computed(() => ({
    title: { required, minLength: minLength(3) },
    description: {},
    startDate: { required },
    endDate: { required },
    userId: { required }
  }))
  const v$ = useVuelidate(rules, form)
  const getErrorMessage = getErrorMessageFactory(v$)
  const isFieldValid = isFieldValidFactory(v$)
  const isFieldInvalid = isFieldInvalidFactory(v$)
  const getFieldClass = getFieldClassFactory(v$)
  const getFieldError = getFieldErrorFactory(getErrorMessage)
  const isFormValid = isFormValidFactory(v$)
  return {
    v$,
    getErrorMessage,
    getFieldClass,
    getFieldError,
    isFieldValid,
    isFieldInvalid,
    isFormValid
  }
}
