import { ref, computed } from 'vue'

export function useErrorHandling() {
  const errors = ref([])
  const errorMessage = ref('')

  const hasErrors = computed(() => errors.value.length > 0 || !!errorMessage.value)

  const setError = (message, details = []) => {
    errorMessage.value = message
    errors.value = details
  }

  const setApiError = (error) => {
    errorMessage.value = error.message || 'An error occurred'
    errors.value = error.details || []
  }

  const clearErrors = () => {
    errorMessage.value = ''
    errors.value = []
  }

  const getFieldError = (fieldName) => {
    const fieldError = errors.value.find(error => error.field === fieldName)
    return fieldError?.message || ''
  }

  const hasFieldError = (fieldName) => {
    return errors.value.some(error => error.field === fieldName)
  }

  // Format error details for display
  const formattedErrors = computed(() => {
    if (errors.value.length === 0) return errorMessage.value

    const fieldErrors = errors.value.map(error =>
      error.field ? `${error.field}: ${error.message}` : error.message
    ).join(', ')

    return errorMessage.value ? `${errorMessage.value}. ${fieldErrors}` : fieldErrors
  })

  return {
    errors,
    errorMessage,
    hasErrors,
    formattedErrors,
    setError,
    setApiError,
    clearErrors,
    getFieldError,
    hasFieldError
  }
}
