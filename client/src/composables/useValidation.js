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
      required,
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

export function useAuthValidation(form, isLogin = true) {
  const rules = computed(() => {
    if (isLogin) {
      return {
        email: { required, email },
        password: { required }
      }
    }

    return {
      firstName: {
        required,
        minLength: minLength(2),
        nameValidator
      },
      lastName: {
        required,
        minLength: minLength(2),
        nameValidator
      },
      email: { required, email },
      password: { required, passwordStrength },
      confirmPassword: {
        required,
        sameAs: sameAs(form.password)
      }
    }
  })

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
